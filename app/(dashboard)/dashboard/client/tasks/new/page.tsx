import { redirect } from 'next/navigation'
import { requireRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { NewTaskForm } from '@/components/tasks/NewTaskForm'

export default async function NewTaskPage() {
  const profile = await requireRole('client')
  const supabase = await createClient()

  // Get user's projects for the dropdown
  const { data: projects } = await supabase
    .from('projects')
    .select('id, name')
    .eq('client_id', profile.id)
    .order('name')

  // If no projects, redirect to create a project first
  if (!projects || projects.length === 0) {
    redirect('/dashboard/client/projects/new')
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
        <p className="text-muted-foreground mt-2">Create a new task (select a project)</p>
      </div>
      <NewTaskForm 
        clientId={profile.id} 
        projects={projects}
        contentTypes={contentTypes || []}
        platforms={platforms || []}
        durations={durations || []}
        dimensions={dimensions || []}
      />
    </div>
  )
}
