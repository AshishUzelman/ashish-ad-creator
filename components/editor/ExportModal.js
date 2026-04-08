'use client'
import { useState } from 'react'
import { X, Download } from 'lucide-react'
import { TOKEN_COSTS } from '@/hooks/useTokens'

export default function ExportModal({ onClose, onExport, balance }) {
  const [format, setFormat] = useState('png')
  const [quality, setQuality] = useState(0.92)
  const cost = TOKEN_COSTS.single_export
  const canAfford = balance >= cost

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-80">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white">Export</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={16} /></button>
        </div>
        <div className="flex flex-col gap-3 mb-6">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Format</label>
            <select value={format} onChange={e => setFormat(e.target.value)}
              className="w-full bg-gray-800 text-white text-sm px-2 py-1.5 rounded">
              <option value="png">PNG (lossless)</option>
              <option value="jpeg">JPEG (smaller file)</option>
            </select>
          </div>
          {format === 'jpeg' && (
            <div>
              <label className="text-xs text-gray-500 block mb-1">Quality — {Math.round(quality * 100)}%</label>
              <input type="range" min={0.5} max={1} step={0.01} value={quality}
                onChange={e => setQuality(parseFloat(e.target.value))}
                className="w-full accent-blue-500" />
            </div>
          )}
          <div className="bg-gray-800 rounded-lg px-3 py-2 flex items-center justify-between">
            <span className="text-xs text-gray-400">Token cost</span>
            <span className="text-sm font-medium text-white">{cost} token{cost !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Your balance</span>
            <span className={`text-sm font-medium ${canAfford ? 'text-green-400' : 'text-red-400'}`}>
              {balance} tokens
            </span>
          </div>
        </div>
        {!canAfford && (
          <p className="text-xs text-red-400 mb-3">Insufficient tokens. Upgrade your plan to export.</p>
        )}
        <button
          onClick={() => { onExport(format, quality); onClose() }}
          disabled={!canAfford}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-sm font-medium py-2 rounded-lg transition-colors"
        >
          <Download size={14} /> Export {format.toUpperCase()}
        </button>
      </div>
    </div>
  )
}
