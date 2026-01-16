import { redirect } from 'next/navigation'
import { requireRole } from '@/lib/auth'

export default async function NewProjectPage() {
  await requireRole('client')
  // Redirect to projects page - project creation is now handled via dialog
  redirect('/dashboard/client/projects')
}
