'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '../providers'
import { useProjects } from '@/hooks/useProjects'
import { createProject } from '@/lib/firestore'

function ProjectCard({ project, onClick }) {
  const date = project.createdAt?.toDate?.()?.toLocaleDateString() ?? '—'
  return (
    <button
      onClick={onClick}
      className="text-left bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-600 transition-colors group"
    >
      <div className="w-full aspect-video bg-gray-800 rounded-lg mb-4 flex items-center justify-center text-gray-600 text-sm">
        No preview
      </div>
      <p className="font-medium text-white truncate group-hover:text-blue-400 transition-colors">
        {project.name}
      </p>
      <p className="text-xs text-gray-500 mt-1">{date}</p>
    </button>
  )
}

export default function Dashboard() {
  const { user, loading: authLoading, signOut } = useAuthContext()
  const router = useRouter()
  const { projects, loading: projectsLoading } = useProjects(user?.uid)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) router.push('/')
  }, [user, authLoading, router])

  async function handleNewProject() {
    if (!user || creating) return
    setCreating(true)
    try {
      const doc = await createProject(user.uid, 'Untitled Project')
      router.push(`/editor/${doc.id}`)
    } finally {
      setCreating(false)
    }
  }

  if (authLoading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-950">
        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 px-8 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Ad Creator</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
            {user.tokenBalance ?? 5} tokens
          </span>
          {user.photoURL && (
            <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full" />
          )}
          <button
            onClick={signOut}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-semibold">Your Projects</h2>
          <button
            onClick={handleNewProject}
            disabled={creating}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            {creating ? 'Creating…' : '+ New Project'}
          </button>
        </div>

        {projectsLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-500">
            <p className="mb-4">No projects yet.</p>
            <button
              onClick={handleNewProject}
              className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
            >
              Create your first project →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {projects.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                onClick={() => router.push(`/editor/${p.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
