'use client'
import { useEffect, useRef } from 'react'

export default function FabricCanvas({ width, height, onReady, onModified, onSelectionChange }) {
  const canvasRef = useRef(null)
  const fabricRef = useRef(null)

  useEffect(() => {
    let isMounted = true
    import('fabric').then(({ fabric }) => {
      if (!isMounted || !canvasRef.current) return
      const canvas = new fabric.Canvas(canvasRef.current, {
        width,
        height,
        backgroundColor: '#1a1a1a',
        preserveObjectStacking: true,
      })
      fabricRef.current = canvas
      canvas.on('object:modified', () => onModified?.(canvas))
      canvas.on('object:added', () => onModified?.(canvas))
      canvas.on('object:removed', () => onModified?.(canvas))
      canvas.on('selection:created', (e) => onSelectionChange?.(e.selected?.[0] ?? null))
      canvas.on('selection:updated', (e) => onSelectionChange?.(e.selected?.[0] ?? null))
      canvas.on('selection:cleared', () => onSelectionChange?.(null))
      onReady?.(canvas)
    })
    return () => {
      isMounted = false
      fabricRef.current?.dispose()
    }
  }, [])

  return (
    <div className="flex items-center justify-center flex-1 bg-gray-900 overflow-auto p-8">
      <div className="shadow-2xl">
        <canvas ref={canvasRef} />
      </div>
    </div>
  )
}
