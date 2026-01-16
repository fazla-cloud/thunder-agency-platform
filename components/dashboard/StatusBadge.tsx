import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type Status = 'drafts' | 'in_progress' | 'completed' | 'archived' | 'active' | string

interface StatusBadgeProps {
  status: Status
  className?: string
}

const statusColors: Record<string, string> = {
  drafts: 'status-drafts',
  in_progress: 'status-in-progress',
  completed: 'status-completed',
  archived: 'status-archived',
  active: 'status-active',
}

const statusLabels: Record<string, string> = {
  drafts: 'Drafts',
  in_progress: 'In Progress',
  completed: 'Completed',
  archived: 'Archived',
  active: 'Active',
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const colorClass = statusColors[status] || 'bg-muted text-foreground border border-border'
  const label = statusLabels[status] || status

  return (
    <Badge className={cn(colorClass, 'font-medium text-xs px-2.5 py-0.5', className)} variant="secondary">
      {label}
    </Badge>
  )
}
