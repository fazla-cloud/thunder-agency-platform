'use client'

import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

interface DashboardLayoutClientProps {
  role: 'client' | 'admin' | 'designer' | 'marketer'
  userName?: string | null
  avatarUrl?: string | null
  children: React.ReactNode
}

export function DashboardLayoutClient({ 
  role, 
  userName, 
  avatarUrl, 
  children 
}: DashboardLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const openSidebar = () => {
    setSidebarOpen(true)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        role={role} 
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />
      <div className="flex flex-1 flex-col overflow-hidden bg-background lg:ml-0">
        <Header 
          userName={userName} 
          avatarUrl={avatarUrl}
          onMenuClick={openSidebar}
        />
        <main className="flex-1 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  )
}
