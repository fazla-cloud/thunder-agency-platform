'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { taskSchema, type TaskInput } from '@/lib/validations'

interface NewTaskFormProps {
  clientId: string
  projectId?: string // If provided, project is pre-selected and field is hidden
  projects: Array<{ id: string; name: string }>
  contentTypes: Array<{ id: string; name: string }>
  platforms: Array<{ id: string; name: string }>
  durations: Array<{ id: string; label: string; seconds: number }>
  dimensions: Array<{ id: string; label: string; value: string }>
  onSuccess?: () => void
  onCancel?: () => void
}

export function NewTaskForm({ 
  clientId,
  projectId,
  projects, 
  contentTypes, 
  platforms, 
  durations, 
  dimensions,
  onSuccess,
  onCancel
}: NewTaskFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<TaskInput>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      status: 'drafts',
    },
  })

  const onSubmit = async (data: TaskInput) => {
    setLoading(true)
    setError(null)

    try {
      const { error: insertError } = await (supabase
        .from('tasks') as any)
        .insert({
          client_id: clientId,
          project_id: projectId || data.project_id,
          title: data.title,
          content_type: data.content_type,
          platform: data.platform,
          duration_seconds: data.duration_seconds || null,
          dimensions: data.dimensions || null,
          brief: data.brief,
          status: data.status || 'drafts',
        })

      if (insertError) throw insertError

      reset()
      router.refresh()
      onSuccess?.()
    } catch (err: any) {
      setError(err.message || 'Failed to create task')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {!projectId ? (
        <div className="space-y-2">
          <Label htmlFor="project_id">Project *</Label>
          <Controller
            name="project_id"
            control={control}
            rules={{ required: 'Please select a project' }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.project_id && (
            <p className="text-sm text-destructive">{errors.project_id.message}</p>
          )}
        </div>
      ) : (
        <div className="rounded-md bg-muted p-3">
          <Label className="text-sm text-muted-foreground">Project</Label>
          <p className="text-sm font-medium text-foreground">{projects[0]?.name}</p>
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="title">Task Title *</Label>
        <Input
          id="title"
          {...register('title')}
          placeholder="Create Instagram post for product launch"
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="content_type">Content Type *</Label>
          <Controller
            name="content_type"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  {contentTypes.map((type) => (
                    <SelectItem key={type.id} value={type.name}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.content_type && (
            <p className="text-sm text-destructive">{errors.content_type.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="platform">Platform *</Label>
          <Controller
            name="platform"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map((platform) => (
                    <SelectItem key={platform.id} value={platform.name}>
                      {platform.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.platform && (
            <p className="text-sm text-destructive">{errors.platform.message}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration_seconds">Duration</Label>
          <Controller
            name="duration_seconds"
            control={control}
            render={({ field }) => (
              <Select 
                onValueChange={(value) => field.onChange(value === 'none' ? null : parseInt(value))} 
                value={field.value?.toString() || 'none'}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select duration (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {durations.map((duration) => (
                    <SelectItem key={duration.id} value={duration.seconds.toString()}>
                      {duration.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dimensions">Dimensions</Label>
          <Controller
            name="dimensions"
            control={control}
            render={({ field }) => (
              <Select 
                onValueChange={(value) => field.onChange(value === 'none' ? null : value)} 
                value={field.value || 'none'}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select dimensions (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {dimensions.map((dimension) => (
                    <SelectItem key={dimension.id} value={dimension.value}>
                      {dimension.label} ({dimension.value})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="brief">Brief *</Label>
        <Textarea
          id="brief"
          {...register('brief')}
          placeholder="Describe what you need..."
          rows={6}
        />
        {errors.brief && (
          <p className="text-sm text-destructive">{errors.brief.message}</p>
        )}
      </div>
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Task'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            reset()
            onCancel?.()
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
