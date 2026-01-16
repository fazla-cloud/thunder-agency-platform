'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Database } from '@/types/database'
import { Controller, useForm } from 'react-hook-form'

type Task = Database['public']['Tables']['tasks']['Row']

interface TaskEditFormProps {
  task: Task
}

interface TaskUpdate {
  status: 'drafts' | 'in_progress' | 'completed' | 'archived'
  assigned_to: string | null
}

export function TaskEditForm({ task }: TaskEditFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskUpdate>({
    defaultValues: {
      status: task.status,
      assigned_to: task.assigned_to || '',
    },
  })

  const onSubmit = async (data: TaskUpdate) => {
    setLoading(true)
    setError(null)

    try {
      const { error: updateError } = await (supabase
        .from('tasks') as any)
        .update({
          status: data.status,
          assigned_to: data.assigned_to || null,
        })
        .eq('id', task.id)

      if (updateError) throw updateError

      router.push('/dashboard/admin/tasks')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to update task')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>{task.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="drafts">Drafts</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="assigned_to">Assigned To (Designer ID)</Label>
            <Controller
              name="assigned_to"
              control={control}
              render={({ field }) => (
                <Input
                  id="assigned_to"
                  placeholder="Enter designer UUID (mock for demo)"
                  value={field.value || ''}
                  onChange={field.onChange}
                />
              )}
            />
            <p className="text-xs text-muted-foreground">
              For demo purposes, enter a mock designer UUID
            </p>
          </div>
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Task'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
