'use client'
import { useRef } from 'react'
import { Type, Image, Undo2, Redo2, Download, Wand2 } from 'lucide-react'

export default function Toolbar({ onAddText, onAddImage, onUndo, onRedo, onExport, onStitch, canUndo, canRedo, projectName }) {
  const fileRef = useRef(null)
  return (
    <header className="border-b border-gray-800 px-4 py-2 flex items-center gap-3 shrink-0">
      <span className="text-sm font-medium text-white mr-2 truncate max-w-[160px]">
        {projectName || 'Untitled'}
      </span>
      <div className="h-4 w-px bg-gray-700" />
      <button onClick={onAddText} title="Add Text"
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white px-2 py-1.5 rounded hover:bg-gray-800 transition-colors">
        <Type size={14} /> Text
      </button>
      <button onClick={() => fileRef.current?.click()} title="Add Image"
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white px-2 py-1.5 rounded hover:bg-gray-800 transition-colors">
        <Image size={14} /> Image
      </button>
      <input ref={fileRef} type="file" accept="image/*" className="hidden"
        onChange={e => { if (e.target.files[0]) { onAddImage(e.target.files[0]); e.target.value = '' } }} />
      <div className="h-4 w-px bg-gray-700" />
      <button onClick={onUndo} disabled={!canUndo} title="Undo"
        className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-30 transition-colors">
        <Undo2 size={14} />
      </button>
      <button onClick={onRedo} disabled={!canRedo} title="Redo"
        className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-30 transition-colors">
        <Redo2 size={14} />
      </button>
      <div className="flex-1" />
      <button onClick={onStitch}
        className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 px-2 py-1.5 rounded hover:bg-gray-800 transition-colors">
        <Wand2 size={14} /> AI Generate
      </button>
      <button onClick={onExport}
        className="flex items-center gap-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded transition-colors">
        <Download size={14} /> Export
      </button>
    </header>
  )
}
