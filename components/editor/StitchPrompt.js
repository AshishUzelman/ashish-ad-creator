'use client'
import { useState } from 'react'
import { Wand2, X } from 'lucide-react'

export default function StitchPrompt({ onGenerate, onClose, canvasWidth, canvasHeight }) {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleGenerate() {
    if (!prompt.trim()) return
    setLoading(true)
    setError('')
    try {
      await onGenerate(prompt.trim())
      onClose()
    } catch (err) {
      setError(err.message || 'Generation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-96">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Wand2 size={16} className="text-purple-400" />
            <h2 className="font-semibold text-white">AI Generate Layout</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={16} /></button>
        </div>
        <p className="text-xs text-gray-500 mb-3">
          Describe your ad. Stitch (Gemini 2.5) will generate a layout at {canvasWidth}×{canvasHeight}px.
        </p>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="e.g. Modern real estate ad with dark background, white headline text, subtle gold accents"
          rows={4}
          className="w-full bg-gray-800 text-white text-sm px-3 py-2 rounded-lg resize-none mb-3 placeholder:text-gray-600"
        />
        {error && <p className="text-xs text-red-400 mb-3">{error}</p>}
        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-sm font-medium py-2 rounded-lg transition-colors"
        >
          {loading ? (
            <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating…</>
          ) : (
            <><Wand2 size={14} /> Generate</>
          )}
        </button>
      </div>
    </div>
  )
}
