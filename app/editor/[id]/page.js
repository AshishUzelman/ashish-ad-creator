import EditorShell from '@/components/editor/EditorShell'

export default async function EditorPage({ params }) {
  const { id } = await params
  return <EditorShell projectId={id} />
}
