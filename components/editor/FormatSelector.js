'use client'
import { useState } from 'react'
import { AD_FORMATS } from '@/lib/fabric-utils'

export default function FormatSelector({ currentFormat, onSelect }) {
  const [customW, setCustomW] = useState(800)
  const [customH, setCustomH] = useState(600)

  return (
    <div className="p-4 border-b border-gray-800">
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Canvas Size</p>
      <div className="flex flex-col gap-1">
        {AD_FORMATS.filter(f => f.id !== 'custom').map((f) => (
          <button
            key={f.id}
            onClick={() => onSelect(f)}
            className={`text-left text-sm px-2 py-1.5 rounded transition-colors ${
              currentFormat?.id === f.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            {f.label}
            <span className="ml-2 text-xs opacity-60">{f.width}×{f.height}</span>
          </button>
        ))}
        <div className="mt-2 pt-2 border-t border-gray-800">
          <p className="text-xs text-gray-500 mb-1">Custom</p>
          <div className="flex gap-1 items-center">
            <input type="number" value={customW} onChange={e => setCustomW(Number(e.target.value))}
              className="w-16 bg-gray-800 text-white text-xs px-2 py-1 rounded" />
            <span className="text-gray-600 text-xs">×</span>
            <input type="number" value={customH} onChange={e => setCustomH(Number(e.target.value))}
              className="w-16 bg-gray-800 text-white text-xs px-2 py-1 rounded" />
            <button
              onClick={() => onSelect({ id: 'custom', label: 'Custom', width: customW, height: customH })}
              className="text-xs text-blue-400 hover:text-blue-300 ml-1"
            >Apply</button>
          </div>
        </div>
      </div>
    </div>
  )
}
