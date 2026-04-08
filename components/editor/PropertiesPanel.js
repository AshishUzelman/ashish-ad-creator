'use client'

export default function PropertiesPanel({ selectedObject, onChange }) {
  if (!selectedObject) {
    return (
      <div className="p-4 text-xs text-gray-600 text-center">
        Select a layer to edit its properties.
      </div>
    )
  }
  const isText = selectedObject.type === 'i-text' || selectedObject.type === 'text'

  function update(prop, value) {
    selectedObject.set(prop, value)
    selectedObject.canvas?.renderAll()
    onChange?.()
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <div>
        <label className="text-xs text-gray-500 block mb-1">
          Opacity — {Math.round((selectedObject.opacity ?? 1) * 100)}%
        </label>
        <input type="range" min={0} max={1} step={0.01}
          defaultValue={selectedObject.opacity ?? 1}
          onChange={e => update('opacity', parseFloat(e.target.value))}
          className="w-full accent-blue-500" />
      </div>
      {isText && (
        <>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Font Size</label>
            <input type="number" defaultValue={selectedObject.fontSize ?? 48}
              onChange={e => update('fontSize', parseInt(e.target.value, 10))}
              className="w-full bg-gray-800 text-white text-sm px-2 py-1 rounded" />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Color</label>
            <input type="color" defaultValue={selectedObject.fill ?? '#ffffff'}
              onChange={e => update('fill', e.target.value)}
              className="w-10 h-8 bg-gray-800 border-0 rounded cursor-pointer" />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Font Family</label>
            <select defaultValue={selectedObject.fontFamily ?? 'Inter, sans-serif'}
              onChange={e => update('fontFamily', e.target.value)}
              className="w-full bg-gray-800 text-white text-sm px-2 py-1 rounded">
              <option value="Inter, sans-serif">Inter</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="'Helvetica Neue', sans-serif">Helvetica</option>
              <option value="'Courier New', monospace">Courier</option>
            </select>
          </div>
        </>
      )}
      <div>
        <label className="text-xs text-gray-500 block mb-1">Blend Mode</label>
        <select defaultValue={selectedObject.globalCompositeOperation ?? 'source-over'}
          onChange={e => update('globalCompositeOperation', e.target.value)}
          className="w-full bg-gray-800 text-white text-sm px-2 py-1 rounded">
          {['source-over','multiply','screen','overlay','darken','lighten','color-dodge','color-burn'].map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-gray-500 block mb-1">X</label>
          <input type="number" defaultValue={Math.round(selectedObject.left ?? 0)}
            onChange={e => update('left', parseInt(e.target.value, 10))}
            className="w-full bg-gray-800 text-white text-xs px-2 py-1 rounded" />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Y</label>
          <input type="number" defaultValue={Math.round(selectedObject.top ?? 0)}
            onChange={e => update('top', parseInt(e.target.value, 10))}
            className="w-full bg-gray-800 text-white text-xs px-2 py-1 rounded" />
        </div>
      </div>
    </div>
  )
}
