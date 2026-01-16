'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Controller, useForm } from 'react-hook-form'
import { StatusBadge } from '@/components/dashboard/StatusBadge'

interface Task {
  id: string
  title: string
  status: string
  projects: { name: string } | null
}

interface AssignTaskFormProps {
  tasks: Task[]
}

interface AssignFormData {
  task_id: string
  assigned_to: string
}

export function AssignTaskForm({ tasks }: AssignTaskFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AssignFormData>()

  const onSubmit = async (data: AssignFormData) => {
    setLoading(true)
    setError(null)

    try {
      const { error: updateError } = await (supabase
        .from('tasks') as any)
        .update({
          assigned_to: data.assigned_to,
          status: 'accepted', // Auto-accept when assigned
        })
        .eq('id', data.task_id)

      if (updateError) throw updateError

      router.push('/dashboard/admin/tasks')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to assign task')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Assign Task to Designer</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task_id">Select Task</Label>
            <Controller
              name="task_id"
              control={control}
              rules={{ required: 'Please select a task' }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a task" />
                  </SelectTrigger>
                  <SelectContent>
                    {tasks.map((task) => {
                      const projectName = (task.projects as any)?.name || 'Unknown'
                      return (
                        <SelectItem key={task.id} value={task.id}>
                          <div className="flex items-center gap-2">
                            <span>{task.title}</span>
                            <StatusBadge status={task.status} />
                            <span className="text-xs text-muted-foreground">
                              ({projectName})
                            </span>
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.task_id && (
              <p className="text-sm text-destructive">{errors.task_id.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="assigned_to">Designer ID</Label>
            <Controller
              name="assigned_to"
              control={control}
              rules={{ required: 'Please enter a designer ID' }}
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
              For demo purposes, enter a mock designer UUID. In production, this would be a dropdown of actual designers.
            </p>
            {errors.assigned_to && (
              <p className="text-sm text-destructive">{errors.assigned_to.message}</p>
            )}
          </div>
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Assigning...' : 'Assign Task'}
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
