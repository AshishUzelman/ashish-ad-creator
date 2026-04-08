'use client'
import { useState, useEffect } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export function useProject(projectId) {
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!projectId) return
    const unsub = onSnapshot(doc(db, 'projects', projectId), (snap) => {
      setProject(snap.exists() ? { id: snap.id, ...snap.data() } : null)
      setLoading(false)
    })
    return unsub
  }, [projectId])

  return { project, loading }
}
