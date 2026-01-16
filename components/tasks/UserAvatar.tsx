'use client'

import Image from 'next/image'
import { User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface UserAvatarProps {
  userId: string | null
  avatarUrl: string | null
  name: string | null
  size?: 'sm' | 'md' | 'lg'
}

export function UserAvatar({ userId, avatarUrl, name, size = 'sm' }: UserAvatarProps) {
  const supabase = createClient()
  
  const getAvatarUrl = (path: string | null) => {
    if (!path) return null
    try {
      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      return data.publicUrl
    } catch {
      return null
    }
  }

  const avatarPublicUrl = avatarUrl ? getAvatarUrl(avatarUrl) : null
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  }
  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden border border-border shrink-0`}>
      {avatarPublicUrl ? (
        <Image
          src={avatarPublicUrl}
          alt={name || 'User'}
          width={size === 'sm' ? 24 : size === 'md' ? 32 : 40}
          height={size === 'sm' ? 24 : size === 'md' ? 32 : 40}
          className="object-cover w-full h-full"
        />
      ) : (
        <div className="w-full h-full bg-muted flex items-center justify-center">
          <User className={`${iconSizes[size]} text-muted-foreground`} />
        </div>
      )}
    </div>
  )
}
