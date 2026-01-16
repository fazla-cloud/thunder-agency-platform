'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { LogOut, User, Settings, Menu } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

interface HeaderProps {
  userName?: string | null
  avatarUrl?: string | null
  onMenuClick?: () => void
}

export function Header({ userName, avatarUrl, onMenuClick }: HeaderProps) {
  const supabase = createClient()
  
  // Get public URL for avatar
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

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      // Use window.location for full page navigation to ensure cookies are cleared
      window.location.href = '/login'
    } catch (error) {
      console.error('Error signing out:', error)
      // Still redirect even if signOut fails
      window.location.href = '/login'
    }
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 sm:px-6">
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <h2 className="text-lg font-semibold text-foreground tracking-tight">Dashboard</h2>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 hover:bg-muted/50">
              {avatarPublicUrl ? (
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-border">
                  <Image
                    src={avatarPublicUrl}
                    alt={userName || 'User'}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center border border-border">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
              <span className="hidden sm:inline font-medium">{userName || 'User'}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="font-medium">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile" className="cursor-pointer flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                <span>Profile Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
