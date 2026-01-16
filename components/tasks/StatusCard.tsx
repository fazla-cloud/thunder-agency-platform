import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface StatusCardProps {
  label: string
  count: number
  icon: LucideIcon
}

export function StatusCard({ label, count, icon: Icon }: StatusCardProps) {
  return (
    <Card className="border-border bg-card dark:bg-card">
      <CardContent className="pt-4 pb-4 px-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-muted dark:bg-muted">
            <Icon className="h-4 w-4 text-foreground dark:text-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-muted-foreground mb-0.5">{label}</div>
            <div className="text-xl font-semibold tracking-tight">{count}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
