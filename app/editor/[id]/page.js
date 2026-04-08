import EditorShell from '@/components/editor/EditorShell'

export default function EditorPage({ params }) {
  return <EditorShell projectId={params.id} />
}
