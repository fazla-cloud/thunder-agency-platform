import { redirect } from 'next/navigation'

export default async function EditTaskPage() {
  // This page has been replaced with a dialog
  // Redirect to admin tasks page
  redirect('/dashboard/admin/tasks')
}
