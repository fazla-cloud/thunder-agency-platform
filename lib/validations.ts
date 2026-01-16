import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
})

export const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  status: z.string().optional(),
})

export const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  project_id: z.string().uuid('Invalid project ID').optional(),
  content_type: z.string().min(1, 'Content type is required'),
  platform: z.string().min(1, 'Platform is required'),
  duration_seconds: z.number().int().positive().optional().nullable(),
  dimensions: z.string().optional().nullable(),
  brief: z.string().min(1, 'Brief is required'),
  status: z.enum(['drafts', 'in_progress', 'completed', 'archived']).optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>
export type ProjectInput = z.infer<typeof projectSchema>
export type TaskInput = z.infer<typeof taskSchema>
