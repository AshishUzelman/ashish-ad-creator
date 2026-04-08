'use client'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '../../providers'
import { useEffect } from 'react'

export default function EditorPage({ params }) {
  const { user, loading } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.push('/')
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-950">
        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col">
      <header className="border-b border-gray-800 px-6 py-3 flex items-center gap-4">
        <button
          onClick={() => router.push('/dashboard')}
          className="text-gray-400 hover:text-white text-sm transition-colors"
        >
          ← Dashboard
        </button>
        <span className="text-gray-600">|</span>
        <span className="text-sm text-gray-400">Project: {params.id}</span>
      </header>
      <div className="flex-1 flex items-center justify-center text-gray-600">
        Canvas editor coming soon.
      </div>
    </main>
  )
}
