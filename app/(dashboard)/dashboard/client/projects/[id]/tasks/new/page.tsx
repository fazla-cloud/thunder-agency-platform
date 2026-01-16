import { redirect } from 'next/navigation'
import { requireRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { NewTaskForm } from '@/components/tasks/NewTaskForm'

export default async function NewProjectTaskPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const profile = await requireRole('client')
  const { id: projectId } = await params
  const supabase = await createClient()

  // Verify project belongs to user
  const { data: project } = await supabase
    .from('projects')
    .select('id, name')
    .eq('id', projectId)
    .eq('client_id', profile.id)
    .single()

  if (!project) {
    redirect('/dashboard/client/projects')
  }

  // Get all options for selects
  const { data: contentTypes } = await supabase
    .from('content_types')
    .select('id, name')
    .order('name')

  const { data: platforms } = await supabase
    .from('platforms')
    .select('id, name')
    .order('name')

  const { data: durations } = await supabase
    .from('durations')
    .select('id, label, seconds')
    .order('seconds')

  const { data: dimensions } = await supabase
    .from('dimensions')
    .select('id, label, value')
    .order('label')

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">New Task</h1>
        <p className="text-muted-foreground mt-2">Create a new task for project: {project.name}</p>
      </div>
      <NewTaskForm 
        clientId={profile.id}
        projectId={projectId}
        projects={[project]}
        contentTypes={contentTypes || []}
        platforms={platforms || []}
        durations={durations || []}
        dimensions={dimensions || []}
      />
    </div>
  )
}
