import { redirect } from 'next/navigation'
import { requireRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { UsersManager } from '@/components/admin/UsersManager'
import { Database } from '@/types/database'

export default async function AdminUsersPage() {
  const profile = await requireRole('admin')
  const supabase = await createClient()

  // Get all users
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching users:', error)
  }

  // Note: To get user emails, you would need to use Supabase Admin API with service role key
  // For now, we'll show user IDs. In production, create a server action or API route
  // that uses the service role key to fetch emails securely.
  
  // Combine profile data with email placeholder
  const usersWithEmail = (profiles as Array<Database['public']['Tables']['profiles']['Row']>)?.map(profile => ({
    ...profile,
    email: `User ${profile.id.slice(0, 8)}...`, // Placeholder - would be actual email with service role
  })) || []

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">User Management</h1>
        <p className="text-muted-foreground mt-2">Manage user roles and titles</p>
      </div>

      <UsersManager initialUsers={usersWithEmail} />
    </div>
  )
}
