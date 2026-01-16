import { redirect } from 'next/navigation'
import { getCurrentProfile, requireRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { DashboardCard } from '@/components/dashboard/DashboardCard'
import { TaskStatusChart } from '@/components/dashboard/TaskStatusChart'
import { TasksOverTimeChart } from '@/components/dashboard/TasksOverTimeChart'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { CheckSquare, Clock, CheckCircle2 } from 'lucide-react'

export default async function ClientDashboard() {
  const profile = await requireRole('client')
  const supabase = await createClient()

  // Get task data with all needed fields
  const { data: tasks } = await supabase
    .from('tasks')
    .select('status, created_at')
    .eq('client_id', profile.id)
    .order('created_at', { ascending: false })

  const totalTasks = tasks?.length || 0
  const inProgressTasks = (tasks as Array<{ status: string }>)?.filter(t => t.status === 'in_progress').length || 0
  const completedTasks = (tasks as Array<{ status: string }>)?.filter(t => t.status === 'completed').length || 0

  // Prepare status distribution data - show all statuses even if empty
  const allStatuses = ['drafts', 'in_progress', 'completed', 'archived']
  const statusCounts = (tasks as Array<{ status: string }>)?.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  const statusData = allStatuses.map(status => ({
    status,
    count: statusCounts[status] || 0,
  }))

  // Prepare tasks over time data (last 7 days)
  const now = new Date()
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(now)
    date.setDate(date.getDate() - (6 - i))
    return date.toISOString().split('T')[0]
  })

  const tasksByDate = (tasks as Array<{ created_at: string }>)?.reduce((acc, task) => {
    const date = new Date(task.created_at).toISOString().split('T')[0]
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  const tasksOverTimeData = last7Days.map(date => ({
    date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    count: tasksByDate[date] || 0,
  }))

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">Welcome back, {profile.full_name || 'Client'}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6 sm:mb-8">
        <DashboardCard
          title="Total Tasks"
          value={totalTasks}
          icon={CheckSquare}
          description="All your tasks"
        />
        <DashboardCard
          title="In Progress"
          value={inProgressTasks}
          icon={Clock}
          description="Tasks being worked on"
        />
        <DashboardCard
          title="Completed"
          value={completedTasks}
          icon={CheckCircle2}
          description="Finished tasks"
        />
      </div>

      <div className="mb-6 sm:mb-8">
        <QuickActions role="client" clientId={profile.id} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <TaskStatusChart data={statusData} />
        <TasksOverTimeChart data={tasksOverTimeData} />
      </div>
    </div>
  )
}
