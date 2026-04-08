'use client'
import { useState, useEffect } from 'react'
import { subscribeToProjects } from '@/lib/firestore'

export function useProjects(uid) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!uid) return
    const unsub = subscribeToProjects(uid, (data) => {
      setProjects(data)
      setLoading(false)
    })
    return unsub
  }, [uid])

  return { projects, loading }
}
