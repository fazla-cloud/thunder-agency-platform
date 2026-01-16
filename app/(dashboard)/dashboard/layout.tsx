import { redirect } from 'next/navigation'
import { getCurrentProfile } from '@/lib/auth'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { Header } from '@/components/dashboard/Header'
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
    <div className="flex h-screen bg-background">
      <Sidebar role={profile.role as 'client' | 'admin' | 'designer' | 'marketer'} />
      <div className="flex flex-1 flex-col overflow-hidden bg-background">
        <Header userName={profile.full_name} avatarUrl={profile.avatar_url} />
        <main className="flex-1 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  )
}
