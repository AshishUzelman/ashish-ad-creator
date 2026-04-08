'use client'
import { Image, Type, Trash2 } from 'lucide-react'

const LAYER_ICONS = { image: Image, text: Type, logo: Image }

export default function LayerPanel({ layers, selectedId, onSelect, onDelete }) {
  if (!layers.length) {
    return (
      <div className="p-4 text-xs text-gray-600 text-center">
        No layers yet. Add text or upload an image.
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-0.5 p-2">
      {[...layers].reverse().map((layer) => {
        const Icon = LAYER_ICONS[layer.layerType] ?? Image
        const isSelected = layer.id === selectedId
        return (
          <div
            key={layer.id}
            onClick={() => onSelect(layer.id)}
            className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer group transition-colors ${
              isSelected ? 'bg-blue-600' : 'hover:bg-gray-800'
            }`}
          >
            <Icon size={12} className="shrink-0 opacity-60" />
            <span className="text-xs truncate flex-1">{layer.name || layer.layerType}</span>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(layer.id) }}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-opacity"
            >
              <Trash2 size={11} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
