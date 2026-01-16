import { redirect } from 'next/navigation'
import { requireRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { DashboardCard } from '@/components/dashboard/DashboardCard'
import { TaskStatusChart } from '@/components/dashboard/TaskStatusChart'
import { TasksOverTimeChart } from '@/components/dashboard/TasksOverTimeChart'
import { TasksByPlatformChart } from '@/components/dashboard/TasksByPlatformChart'
import { TasksByContentTypeChart } from '@/components/dashboard/TasksByContentTypeChart'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { CheckSquare, FolderKanban, Clock } from 'lucide-react'

export default async function AdminDashboard() {
  const profile = await requireRole('admin')
  const supabase = await createClient()

  // Get all tasks with needed fields
  const { data: tasks } = await supabase
    .from('tasks')
    .select('status, created_at, platform, content_type')
    .order('created_at', { ascending: false })

  // Get all projects
  const { data: projects } = await supabase
    .from('projects')
    .select('status')

  const allTasks = tasks?.length || 0
  const activeProjects = (projects?.filter((p: { status: string }) => p.status === 'active').length) || 0
  const pendingTasks = (tasks?.filter((t: { status: string }) => t.status === 'drafts').length) || 0

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

  // Prepare tasks by platform data
  const platformCounts = (tasks as Array<{ platform: string }>)?.reduce((acc, task) => {
    acc[task.platform] = (acc[task.platform] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  const platformData = Object.entries(platformCounts)
    .map(([platform, count]) => ({ platform, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10) // Top 10 platforms

  // Prepare tasks by content type data
  const contentTypeCounts = (tasks as Array<{ content_type: string }>)?.reduce((acc, task) => {
    acc[task.content_type] = (acc[task.content_type] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  const contentTypeData = Object.entries(contentTypeCounts)
    .map(([contentType, count]) => ({ contentType, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10) // Top 10 content types

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome back, {profile.full_name || 'Admin'}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <DashboardCard
          title="All Tasks"
          value={allTasks}
          icon={CheckSquare}
          description="Total tasks in system"
        />
        <DashboardCard
          title="Active Projects"
          value={activeProjects}
          icon={FolderKanban}
          description="Currently active projects"
        />
        <DashboardCard
          title="Draft Tasks"
          value={pendingTasks}
          icon={Clock}
          description="Tasks in draft"
        />
      </div>

      <div className="mb-8">
        <QuickActions role="admin" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <TaskStatusChart data={statusData} />
        <TasksOverTimeChart data={tasksOverTimeData} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <TasksByPlatformChart data={platformData} />
        <TasksByContentTypeChart data={contentTypeData} />
      </div>
    </div>
  )
}
