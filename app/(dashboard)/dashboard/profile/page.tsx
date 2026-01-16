import { redirect } from 'next/navigation'
import { getCurrentProfile, requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { ProfileEditor } from '@/components/profile/ProfileEditor'

export default async function ProfilePage() {
  const user = await requireAuth()
  const profile = await getCurrentProfile()
  
  if (!profile) {
    redirect('/login')
  }

  // Get user email from auth
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">My Profile</h1>
        <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">Manage your profile information</p>
      </div>

      <div className="max-w-2xl">
        <ProfileEditor profile={profile} userEmail={authUser?.email || null} />
      </div>
    </div>
  )
}
