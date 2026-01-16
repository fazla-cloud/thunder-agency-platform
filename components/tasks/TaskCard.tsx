'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/dashboard/StatusBadge'
import { Button } from '@/components/ui/button'
import { Database } from '@/types/database'
import { Calendar, Clock, FileText, MoreVertical, UserPlus, User, UserCheck, UserCircle, FolderKanban } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AssignTaskDialog } from '@/components/tasks/AssignTaskDialog'
import { UserAvatar } from './UserAvatar'
import { usePathname } from 'next/navigation'

type Task = Database['public']['Tables']['tasks']['Row'] & {
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

interface TaskCardProps {
  task: Task
  showProject?: boolean
  projectName?: string
  isAdmin?: boolean
}

// Status indicator colors using theme chart colors for visual distinction
const statusBarColors: Record<string, string> = {
  drafts: 'bg-chart-1',
  in_progress: 'bg-chart-3',
  completed: 'bg-chart-2',
  archived: 'bg-chart-5',
}

export function TaskCard({ task, showProject = false, projectName, isAdmin = false }: TaskCardProps) {
  const pathname = usePathname()
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const statusBarColor = statusBarColors[task.status] || 'bg-chart-4'

  // Enhanced admin view
  if (isAdmin) {
    return (
      <>
        <Card className="hover:shadow-lg transition-all duration-200 relative overflow-hidden group border-border">
          {/* Status indicator bar */}
          <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${statusBarColor}`} />
          
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg font-semibold leading-tight mb-2 pr-2">
                  {task.title}
                </CardTitle>
                {showProject && projectName && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
                    <FolderKanban className="h-3.5 w-3.5" />
                    <span>{projectName}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <StatusBadge status={task.status} />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setAssignDialogOpen(true)}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Assign Task
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-0">
            {/* Assigned To & Requested By - Prominent for Admin */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg border border-border">
              {/* Assigned To */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  <UserCheck className="h-3.5 w-3.5" />
                  <span>Assigned To</span>
                </div>
                {task.assigned_to && task.assigned_profile ? (
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      userId={task.assigned_profile.id}
                      avatarUrl={task.assigned_profile.avatar_url}
                      name={task.assigned_profile.full_name}
                      size="md"
                    />
                    <div>
                      <div className="font-semibold text-sm text-foreground">
                        {task.assigned_profile.full_name || 'Unnamed'}
                      </div>
                      {task.assigned_profile.id && (
                        <div className="text-xs text-muted-foreground">
                          {task.assigned_profile.id.slice(0, 8)}...
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-8 h-8 rounded-full bg-muted border border-dashed border-border flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                    <span className="italic">Unassigned</span>
                  </div>
                )}
              </div>

              {/* Requested By */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  <UserCircle className="h-3.5 w-3.5" />
                  <span>Requested By</span>
                </div>
                {task.client_profile ? (
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      userId={task.client_profile.id}
                      avatarUrl={task.client_profile.avatar_url}
                      name={task.client_profile.full_name}
                      size="md"
                    />
                    <div>
                      <div className="font-semibold text-sm text-foreground">
                        {task.client_profile.full_name || 'Unnamed'}
                      </div>
                      {task.client_profile.id && (
                        <div className="text-xs text-muted-foreground">
                          {task.client_profile.id.slice(0, 8)}...
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-8 h-8 rounded-full bg-muted border border-dashed border-border flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                    <span className="italic">Unknown</span>
                  </div>
                )}
              </div>
            </div>

            {/* Task Details Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-2 bg-muted/20 rounded-md">
                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">Type</div>
                  <div className="text-sm font-medium text-foreground truncate">{task.content_type}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 bg-muted/20 rounded-md">
                <div className="h-4 w-4 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">Platform</div>
                  <div className="text-sm font-medium text-foreground truncate">{task.platform}</div>
                </div>
              </div>
              {task.dimensions && (
                <div className="flex items-center gap-2 p-2 bg-muted/20 rounded-md">
                  <div className="h-4 w-4 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs text-muted-foreground">Dimensions</div>
                    <div className="text-sm font-medium text-foreground truncate">{task.dimensions}</div>
                  </div>
                </div>
              )}
              {task.duration_seconds && (
                <div className="flex items-center gap-2 p-2 bg-muted/20 rounded-md">
                  <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs text-muted-foreground">Duration</div>
                    <div className="text-sm font-medium text-foreground">
                      {task.duration_seconds < 60 
                        ? `${task.duration_seconds}s` 
                        : task.duration_seconds < 3600
                        ? `${Math.floor(task.duration_seconds / 60)}m`
                        : `${Math.floor(task.duration_seconds / 3600)}h ${Math.floor((task.duration_seconds % 3600) / 60)}m`
                      }
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Brief */}
            <div className="pt-2 border-t border-border">
              <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Brief</div>
              <p className="text-sm text-foreground leading-relaxed line-clamp-3">
                {task.brief}
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>Created {new Date(task.created_at).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}</span>
              </div>
              {!task.assigned_to && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={(e) => {
                    e.stopPropagation()
                    setAssignDialogOpen(true)
                  }}
                >
                  <UserPlus className="h-3 w-3 mr-1.5" />
                  Assign
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <AssignTaskDialog
          open={assignDialogOpen}
          onOpenChange={setAssignDialogOpen}
          taskId={task.id}
          projectId={task.project_id}
        />
      </>
    )
  }

  // Standard view for non-admin users
  return (
    <>
      <Card className="hover:shadow-md transition-shadow duration-200 relative overflow-hidden">
        {/* Status indicator bar */}
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${statusBarColor}`} />
        
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-base font-semibold leading-tight pr-2 flex-1">
              {task.title}
            </CardTitle>
            <div className="flex items-center gap-2 shrink-0">
              <StatusBadge status={task.status} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          {showProject && projectName && (
            <div className="pb-2 border-b border-border">
              <span className="text-xs text-muted-foreground">Project: </span>
              <span className="text-xs font-medium">{projectName}</span>
            </div>
          )}
          
          {/* Task details */}
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Type:</span>
                <span className="font-medium">{task.content_type}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground">Platform:</span>
                <span className="font-medium">{task.platform}</span>
              </div>
            </div>
            {task.dimensions && (
              <div className="text-xs">
                <span className="text-muted-foreground">Dimensions: </span>
                <span className="font-medium">{task.dimensions}</span>
              </div>
            )}
            {task.duration_seconds && (
              <div className="flex items-center gap-1.5 text-xs">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Duration: </span>
                <span className="font-medium">{task.duration_seconds}s</span>
              </div>
            )}
          </div>

          {/* Brief */}
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
              {task.brief}
            </p>
          </div>

          {/* Assigned To */}
          {task.assigned_to && task.assigned_profile && (
            <div className="pt-2 border-t border-border">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground">Assigned to:</span>
                <div className="flex items-center gap-1.5">
                  <UserAvatar
                    userId={task.assigned_profile.id}
                    avatarUrl={task.assigned_profile.avatar_url}
                    name={task.assigned_profile.full_name}
                    size="sm"
                  />
                  <span className="font-medium text-foreground">
                    {task.assigned_profile.full_name || 'Unnamed'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-2 border-t border-border">
            <Calendar className="h-3.5 w-3.5" />
            <span>Created {new Date(task.created_at).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}</span>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
