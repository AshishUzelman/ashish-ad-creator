'use client'
import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/app/providers'
import { useProject } from '@/hooks/useProject'
import { useCanvas } from '@/hooks/useCanvas'
import { useTokens } from '@/hooks/useTokens'
import FabricCanvas from '@/components/canvas/FabricCanvas'
import Toolbar from '@/components/editor/Toolbar'
import LayerPanel from '@/components/editor/LayerPanel'
import PropertiesPanel from '@/components/editor/PropertiesPanel'
import FormatSelector from '@/components/editor/FormatSelector'
import ExportModal from '@/components/editor/ExportModal'
import StitchPrompt from '@/components/editor/StitchPrompt'
import {
  AD_FORMATS,
  createTextLayer,
  addImageToCanvas,
  exportCanvasToBlob,
  serializeCanvas,
  loadCanvasFromJSON,
} from '@/lib/fabric-utils'
import { updateProjectCanvas, saveExport } from '@/lib/firestore'
import { uploadImage, uploadExport } from '@/lib/storage'
import { generateAdLayout } from '@/lib/stitch'

const AUTOSAVE_DELAY = 1500

export default function EditorShell({ projectId }) {
  const { user, loading: authLoading } = useAuthContext()
  const router = useRouter()
  const { project, loading: projectLoading } = useProject(projectId)
  const {
    canvasRef, onReady, onModified, onSelectionChange,
    selectedObject, undo, redo, canUndo, canRedo,
  } = useCanvas()
  const { deductTokens, balance } = useTokens(user)

  const [format, setFormat] = useState(AD_FORMATS[0])
  const [layers, setLayers] = useState([])
  const [showExport, setShowExport] = useState(false)
  const [showStitch, setShowStitch] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) router.push('/')
  }, [user, authLoading, router])

  // Load saved canvas on project mount
  useEffect(() => {
    if (!project?.canvasJson || !canvasRef.current) return
    loadCanvasFromJSON(canvasRef.current, project.canvasJson)
  }, [project?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  function syncLayers() {
    if (!canvasRef.current) return
    setLayers(
      canvasRef.current.getObjects().map(o => ({
        id: o.id,
        name: o.name,
        layerType: o.layerType || 'image',
      }))
    )
  }

  const handleModified = useCallback((canvas) => {
    onModified(canvas)
    syncLayers()
    clearTimeout(window._autosaveTimer)
    window._autosaveTimer = setTimeout(async () => {
      setSaving(true)
      try { await updateProjectCanvas(projectId, serializeCanvas(canvas)) }
      finally { setSaving(false) }
    }, AUTOSAVE_DELAY)
  }, [onModified, projectId])

  function handleCanvasReady(canvas) {
    onReady(canvas)
    syncLayers()
  }

  function handleAddText() {
    if (!canvasRef.current) return
    const text = createTextLayer()
    canvasRef.current.add(text)
    canvasRef.current.setActiveObject(text)
    canvasRef.current.renderAll()
  }

  async function handleAddImage(file) {
    if (!canvasRef.current || !user) return
    if (file.size > 10 * 1024 * 1024) { alert('Image must be under 10MB'); return }
    const url = await uploadImage(user.uid, file)
    await addImageToCanvas(canvasRef.current, url, { layerType: 'image', name: file.name })
  }

  function handleSelectLayer(id) {
    if (!canvasRef.current) return
    const obj = canvasRef.current.getObjects().find(o => o.id === id)
    if (obj) { canvasRef.current.setActiveObject(obj); canvasRef.current.renderAll() }
  }

  function handleDeleteLayer(id) {
    if (!canvasRef.current) return
    const obj = canvasRef.current.getObjects().find(o => o.id === id)
    if (obj) { canvasRef.current.remove(obj); canvasRef.current.renderAll() }
  }

  function handleFormatChange(newFormat) {
    if (!canvasRef.current) return
    setFormat(newFormat)
    canvasRef.current.setWidth(newFormat.width)
    canvasRef.current.setHeight(newFormat.height)
    canvasRef.current.renderAll()
  }

  async function handleExport(fmt, quality) {
    if (!canvasRef.current || !user) return
    try {
      await deductTokens('single_export', 1)
      const blob = await exportCanvasToBlob(canvasRef.current, fmt, quality)
      const url = await uploadExport(user.uid, projectId, blob, fmt)
      await saveExport(projectId, { url, format: fmt, width: format.width, height: format.height })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `ad-${projectId}.${fmt}`
      a.click()
    } catch (err) {
      alert(err.message)
    }
  }

  async function handleStitchGenerate(prompt) {
    if (!canvasRef.current) return
    const imageUrl = await generateAdLayout(prompt, format.width, format.height)
    await addImageToCanvas(canvasRef.current, imageUrl, { layerType: 'image', name: 'AI Layout' })
  }

  if (authLoading || projectLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-950">
        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </main>
    )
  }

  return (
    <main className="h-screen bg-gray-950 text-white flex flex-col overflow-hidden">
      <Toolbar
        projectName={project?.name}
        onAddText={handleAddText}
        onAddImage={handleAddImage}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        onExport={() => setShowExport(true)}
        onStitch={() => setShowStitch(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-52 border-r border-gray-800 flex flex-col overflow-y-auto shrink-0">
          <FormatSelector currentFormat={format} onSelect={handleFormatChange} />
          <div className="p-3 border-b border-gray-800">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Layers</p>
          </div>
          <LayerPanel
            layers={layers}
            selectedId={selectedObject?.id}
            onSelect={handleSelectLayer}
            onDelete={handleDeleteLayer}
          />
        </aside>

        <FabricCanvas
          width={format.width}
          height={format.height}
          onReady={handleCanvasReady}
          onModified={handleModified}
          onSelectionChange={onSelectionChange}
        />

        <aside className="w-52 border-l border-gray-800 overflow-y-auto shrink-0">
          <div className="p-3 border-b border-gray-800 flex items-center justify-between">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Properties</p>
            {saving && <span className="text-xs text-gray-600">Saving…</span>}
          </div>
          <PropertiesPanel
            selectedObject={selectedObject}
            onChange={() => handleModified(canvasRef.current)}
          />
        </aside>
      </div>

      {showExport && (
        <ExportModal
          balance={balance}
          onClose={() => setShowExport(false)}
          onExport={handleExport}
        />
      )}
      {showStitch && (
        <StitchPrompt
          canvasWidth={format.width}
          canvasHeight={format.height}
          onGenerate={handleStitchGenerate}
          onClose={() => setShowStitch(false)}
        />
      )}
    </main>
  )
}
