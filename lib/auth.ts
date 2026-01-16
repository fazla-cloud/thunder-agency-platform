import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function getCurrentUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function getCurrentProfile() {
  const supabase = await createClient()
  const user = await getCurrentUser()
  
  if (!user) return null

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // If there's an error or no profile, return null
  // This could happen if:
  // 1. Profile doesn't exist (trigger didn't fire)
  // 2. RLS policy is blocking access
  // 3. Database error
  if (error || !profile) {
    console.error('Error fetching profile:', error)
    return null
  }

  return profile as {
    id: string
    role: 'client' | 'admin' | 'designer' | 'marketer'
    full_name: string | null
    title: string | null
    avatar_url: string | null
    is_active: boolean
    created_at: string
  }
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }
  return user
}

import { getDefaultRedirect } from './routing'

export async function requireRole(role: 'client' | 'admin' | 'designer' | 'marketer') {
  const profile = await getCurrentProfile()
  if (!profile) {
    redirect('/login')
  }
  if (profile.role !== role) {
    // Redirect to user's own dashboard if they don't have the required role
    redirect(getDefaultRedirect(profile.role))
  }
  return profile
}

export async function requireAnyRole(roles: Array<'client' | 'admin' | 'designer' | 'marketer'>) {
  const profile = await getCurrentProfile()
  if (!profile || !roles.includes(profile.role)) {
    redirect('/dashboard/client')
  }
  return profile
}
