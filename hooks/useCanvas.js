'use client'
import { useRef, useState, useCallback } from 'react'
import { serializeCanvas, loadCanvasFromJSON } from '@/lib/fabric-utils'

const MAX_HISTORY = 30

export function useCanvas() {
  const canvasRef = useRef(null)
  const historyRef = useRef([])
  const historyIndexRef = useRef(-1)
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const [selectedObject, setSelectedObject] = useState(null)

  const syncHistoryFlags = useCallback(() => {
    setCanUndo(historyIndexRef.current > 0)
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1)
  }, [])

  const pushHistory = useCallback((canvas) => {
    const snapshot = serializeCanvas(canvas)
    historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1)
    historyRef.current.push(snapshot)
    if (historyRef.current.length > MAX_HISTORY) historyRef.current.shift()
    historyIndexRef.current = historyRef.current.length - 1
    syncHistoryFlags()
  }, [syncHistoryFlags])

  const undo = useCallback(async () => {
    if (!canvasRef.current || historyIndexRef.current <= 0) return
    historyIndexRef.current--
    await loadCanvasFromJSON(canvasRef.current, historyRef.current[historyIndexRef.current])
    syncHistoryFlags()
  }, [syncHistoryFlags])

  const redo = useCallback(async () => {
    if (!canvasRef.current || historyIndexRef.current >= historyRef.current.length - 1) return
    historyIndexRef.current++
    await loadCanvasFromJSON(canvasRef.current, historyRef.current[historyIndexRef.current])
    syncHistoryFlags()
  }, [syncHistoryFlags])

  const onReady = useCallback((canvas) => {
    canvasRef.current = canvas
    pushHistory(canvas)
  }, [pushHistory])

  const onModified = useCallback((canvas) => {
    pushHistory(canvas)
  }, [pushHistory])

  return {
    canvasRef,
    onReady,
    onModified,
    onSelectionChange: setSelectedObject,
    selectedObject,
    undo,
    redo,
    canUndo,
    canRedo,
  }
}
