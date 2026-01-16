import { redirect } from 'next/navigation'

// Redirect to projects page since tasks are now within projects
export default async function ClientTasksPage() {
  redirect('/dashboard/client/projects')
}
