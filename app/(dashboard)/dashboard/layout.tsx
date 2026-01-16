import { redirect } from 'next/navigation'
import { getCurrentProfile } from '@/lib/auth'
import { DashboardLayoutClient } from '@/components/dashboard/DashboardLayoutClient'
import { getDefaultRedirect } from '@/lib/routing'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const profile = await getCurrentProfile()
  
  // If no profile, redirect to login
  // This can happen if the profile wasn't created or RLS is blocking access
  if (!profile) {
    redirect('/login')
  }

  // Route protection is handled at the page level using requireRole()
  // This layout just ensures the user is authenticated and has a profile

  return (
    <DashboardLayoutClient 
      role={profile.role as 'client' | 'admin' | 'designer' | 'marketer'}
      userName={profile.full_name}
      avatarUrl={profile.avatar_url}
    >
      {children}
    </DashboardLayoutClient>
  )
}
