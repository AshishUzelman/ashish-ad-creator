// All Fabric operations that don't belong in a component

export const AD_FORMATS = [
  { label: 'Facebook Feed', width: 1200, height: 628, id: 'fb-feed' },
  { label: 'Instagram Square', width: 1080, height: 1080, id: 'ig-square' },
  { label: 'Instagram Story', width: 1080, height: 1920, id: 'ig-story' },
  { label: 'Google Display', width: 728, height: 90, id: 'gdn-leaderboard' },
  { label: 'Custom', width: null, height: null, id: 'custom' },
]

export function serializeCanvas(fabricCanvas) {
  return fabricCanvas.toJSON(['id', 'name', 'layerType'])
}

export function loadCanvasFromJSON(fabricCanvas, json) {
  return new Promise((resolve) => {
    fabricCanvas.loadFromJSON(json, () => {
      fabricCanvas.renderAll()
      resolve()
    })
  })
}

export function exportCanvasToBlob(fabricCanvas, format = 'png', quality = 0.92) {
  return new Promise((resolve) => {
    const dataURL = fabricCanvas.toDataURL({ format, quality, multiplier: 1 })
    fetch(dataURL).then((r) => r.blob()).then(resolve)
  })
}

export function createTextLayer(text = 'Your text here') {
  const { fabric } = require('fabric')
  return new fabric.IText(text, {
    left: 100, top: 100,
    fontSize: 48,
    fontFamily: 'Inter, sans-serif',
    fill: '#ffffff',
    layerType: 'text',
    name: 'Text Layer',
    id: `text_${Date.now()}`,
  })
}

export function addImageToCanvas(fabricCanvas, url, options = {}) {
  const { fabric } = require('fabric')
  return new Promise((resolve, reject) => {
    fabric.Image.fromURL(url, (img) => {
      if (!img) { reject(new Error('Failed to load image')); return }
      const scale = Math.min(fabricCanvas.width / img.width, fabricCanvas.height / img.height) * 0.8
      img.set({
        left: 50, top: 50,
        scaleX: scale, scaleY: scale,
        layerType: options.layerType || 'image',
        name: options.name || 'Image Layer',
        id: `img_${Date.now()}`,
        ...options,
      })
      fabricCanvas.add(img)
      fabricCanvas.setActiveObject(img)
      fabricCanvas.renderAll()
      resolve(img)
    }, { crossOrigin: 'anonymous' })
  })
}
