import { redirect } from 'next/navigation'
import { getCurrentProfile } from '@/lib/auth'
import { getDefaultRedirect } from '@/lib/routing'

export default async function Home() {
  const profile = await getCurrentProfile()
  
  if (profile) {
    redirect(getDefaultRedirect(profile.role))
  } else {
    redirect('/login')
  }
}
