import { requireRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { TaskListWithTabs } from '@/components/tasks/TaskListWithTabs'
import { Database } from '@/types/database'

export default async function MarketerTasksPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const profile = await requireRole('marketer')
  const supabase = await createClient()
  const { status } = await searchParams

  // Get all tasks assigned to this marketer with profile info
  const { data: tasks, error } = await supabase
    .from('tasks')
    .select(`
      *,
      projects(name),
      assigned_profile:profiles!assigned_to(id, full_name, avatar_url),
      client_profile:profiles!client_id(id, full_name, avatar_url)
    `)
    .eq('assigned_to', profile.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching tasks:', error)
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">My Tasks</h1>
        <p className="text-muted-foreground mt-2">View and manage your assigned tasks</p>
      </div>

      <TaskListWithTabs
        tasks={(tasks as Array<Database['public']['Tables']['tasks']['Row'] & { projects: { name: string } }>) || []}
        showProject={true}
        initialStatus={status || 'all'}
      />
    </div>
  )
}
