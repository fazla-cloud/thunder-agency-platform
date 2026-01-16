'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { TaskList } from './TaskList'
import { Card, CardContent } from '@/components/ui/card'
import { Database } from '@/types/database'

type Task = Database['public']['Tables']['tasks']['Row'] & {
  projects?: { name: string }
}

interface TaskListWithTabsProps {
  tasks: Task[]
  showProject?: boolean
  isAdmin?: boolean
  initialStatus?: string
  searchQuery?: string
  dateFrom?: string
  dateTo?: string
}

const statusTabs = [
  { value: 'all', label: 'All' },
  { value: 'drafts', label: 'Drafts' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'archived', label: 'Archived' },
]

export function TaskListWithTabs({ 
  tasks, 
  showProject = false,
  isAdmin = false,
  initialStatus = 'all',
  searchQuery = '',
  dateFrom = '',
  dateTo = ''
}: TaskListWithTabsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState(initialStatus)

  const handleStatusChange = (value: string) => {
    setStatus(value)
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all') {
      params.delete('status')
    } else {
      params.set('status', value)
    }
    router.push(`?${params.toString()}`)
  }

  // Filter tasks by status
  let filteredTasks = status === 'all' 
    ? tasks 
    : tasks.filter(task => task.status === status)

  // Filter by search query
  if (searchQuery) {
    const query = searchQuery.toLowerCase()
    filteredTasks = filteredTasks.filter((task) =>
      task.title?.toLowerCase().includes(query) ||
      task.brief?.toLowerCase().includes(query) ||
      task.content_type?.toLowerCase().includes(query) ||
      task.platform?.toLowerCase().includes(query)
    )
  }

  // Filter by date range
  if (dateFrom || dateTo) {
    filteredTasks = filteredTasks.filter((task) => {
      const taskDate = new Date(task.created_at).toISOString().split('T')[0]
      if (dateFrom && taskDate < dateFrom) return false
      if (dateTo && taskDate > dateTo) return false
      return true
    })
  }

  // Count tasks by status
  const statusCounts = {
    all: tasks.length,
    drafts: tasks.filter(t => t.status === 'drafts').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    archived: tasks.filter(t => t.status === 'archived').length,
  }

  return (
    <Tabs value={status} onValueChange={handleStatusChange} className="w-full">
      <TabsList className="mb-6">
        {statusTabs.map((tab) => (
          <TabsTrigger 
            key={tab.value} 
            value={tab.value}
          >
            {tab.label}
            {statusCounts[tab.value as keyof typeof statusCounts] > 0 && (
              <span className="ml-1.5 text-xs opacity-70">
                ({statusCounts[tab.value as keyof typeof statusCounts]})
              </span>
            )}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value={status} className="mt-0">
        {filteredTasks.length > 0 ? (
          <TaskList 
            tasks={filteredTasks} 
            showProject={showProject}
            isAdmin={isAdmin}
          />
        ) : (
          <Card className="border-dashed border-border">
            <CardContent className="pt-12 pb-12 text-center">
              <p className="text-muted-foreground">
                {status === 'all' 
                  ? 'No tasks found.'
                  : `No ${statusTabs.find(t => t.value === status)?.label.toLowerCase()} tasks.`
                }
              </p>
            </CardContent>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  )
}
