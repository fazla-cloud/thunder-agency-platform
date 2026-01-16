'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { StatusBadge } from '@/components/dashboard/StatusBadge'
import { Button } from '@/components/ui/button'
import { Database } from '@/types/database'
import { Calendar, Clock, FileText, MoreVertical, UserPlus, Edit, User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AssignTaskDialog } from '@/components/tasks/AssignTaskDialog'
import { EditTaskDialog } from '@/components/tasks/EditTaskDialog'
import { UserAvatar } from './UserAvatar'

type Task = Database['public']['Tables']['tasks']['Row'] & {
  projects?: { name: string }
  assigned_profile?: {
    id: string
    full_name: string | null
    avatar_url: string | null
  } | null
  client_profile?: {
    id: string
    full_name: string | null
    avatar_url: string | null
  } | null
}

interface TaskListProps {
  tasks: Task[]
  showProject?: boolean
  isAdmin?: boolean
}

export function TaskList({ tasks, showProject = false, isAdmin = false }: TaskListProps) {
  const router = useRouter()
  const [assignDialogOpen, setAssignDialogOpen] = useState<string | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState<string | null>(null)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return 'N/A'
    if (seconds < 60) return `${seconds}s`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`
  }

  if (tasks.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-12 text-center">
        <p className="text-muted-foreground">No tasks found.</p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 dark:bg-muted border-b border-border">
              <tr>
                <th className="text-left p-3 text-sm font-semibold text-foreground">Task</th>
                {showProject && (
                  <th className="text-left p-3 text-sm font-semibold text-foreground">Project</th>
                )}
                <th className="text-left p-3 text-sm font-semibold text-foreground">Type</th>
                <th className="text-left p-3 text-sm font-semibold text-foreground">Platform</th>
                <th className="text-left p-3 text-sm font-semibold text-foreground">Assigned To</th>
                {isAdmin && (
                  <th className="text-left p-3 text-sm font-semibold text-foreground">Requested By</th>
                )}
                <th className="text-left p-3 text-sm font-semibold text-foreground">Status</th>
                <th className="text-left p-3 text-sm font-semibold text-foreground">Created</th>
                {isAdmin && (
                  <th className="text-right p-3 text-sm font-semibold text-foreground">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tasks.map((task) => (
                <tr
                  key={task.id}
                  className="hover:bg-muted/30 dark:hover:bg-muted/50 transition-colors duration-150 cursor-pointer group"
                >
                  <td className="p-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-foreground mb-1 line-clamp-2">
                          {task.title}
                        </div>
                        {task.brief && (
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {task.brief}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          {task.duration_seconds && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatDuration(task.duration_seconds)}</span>
                            </div>
                          )}
                          {task.dimensions && (
                            <div className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              <span>{task.dimensions}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  {showProject && (
                    <td className="p-3">
                      <span className="text-sm text-foreground">
                        {task.projects?.name || 'N/A'}
                      </span>
                    </td>
                  )}
                  <td className="p-3">
                    <span className="text-sm text-foreground">{task.content_type}</span>
                  </td>
                  <td className="p-3">
                    <span className="text-sm text-foreground">{task.platform}</span>
                  </td>
                  <td className="p-3">
                    {task.assigned_to ? (
                      task.assigned_profile ? (
                        <div className="flex items-center gap-2">
                          <UserAvatar
                            userId={task.assigned_profile.id}
                            avatarUrl={task.assigned_profile.avatar_url}
                            name={task.assigned_profile.full_name}
                            size="sm"
                          />
                          <span className="text-sm text-foreground">
                            {task.assigned_profile.full_name || 'Unnamed'}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-muted border border-dashed border-border flex items-center justify-center">
                            <User className="h-3 w-3 text-muted-foreground" />
                          </div>
                          <span className="text-sm text-muted-foreground italic">
                            Assigned (ID: {task.assigned_to.slice(0, 8)}...)
                          </span>
                        </div>
                      )
                    ) : (
                      <span className="text-sm text-muted-foreground">Unassigned</span>
                    )}
                  </td>
                  {isAdmin && (
                    <td className="p-3">
                      {task.client_profile ? (
                        <div className="flex items-center gap-2">
                          <UserAvatar
                            userId={task.client_profile.id}
                            avatarUrl={task.client_profile.avatar_url}
                            name={task.client_profile.full_name}
                            size="sm"
                          />
                          <span className="text-sm text-foreground">
                            {task.client_profile.full_name || 'Unnamed'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </td>
                  )}
                  <td className="p-3">
                    <StatusBadge status={task.status} />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(task.created_at)}</span>
                    </div>
                  </td>
                  {isAdmin && (
                    <td className="p-3">
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Options</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditDialogOpen(task.id)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit Task
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setAssignDialogOpen(task.id)}>
                              <UserPlus className="mr-2 h-4 w-4" /> Assign Task
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Task Dialogs */}
      {isAdmin &&
        tasks.map((task) => (
          <AssignTaskDialog
            key={`assign-${task.id}`}
            open={assignDialogOpen === task.id}
            onOpenChange={(open) => {
              setAssignDialogOpen(open ? task.id : null)
              if (!open) {
                // Refresh to reload data
                router.refresh()
              }
            }}
            taskId={task.id}
            projectId={task.project_id}
          />
        ))}

      {/* Edit Task Dialogs */}
      {isAdmin &&
        tasks.map((task) => (
          <EditTaskDialog
            key={`edit-${task.id}`}
            open={editDialogOpen === task.id}
            onOpenChange={(open) => {
              setEditDialogOpen(open ? task.id : null)
              if (!open) {
                // Refresh to reload data
                router.refresh()
              }
            }}
            taskId={task.id}
            initialTask={task}
          />
        ))}
    </>
  )
}
