'use client'

import { useState, useEffect } from 'react'
import { ProjectCard } from './ProjectCard'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Database } from '@/types/database'
import { LayoutGrid, List } from 'lucide-react'

type Project = Database['public']['Tables']['projects']['Row']

interface AdminProjectsListProps {
  projects: Array<Project & { clientName?: string | null }>
  allProjects: Project[]
  initialStatus?: string
  clientMap: Map<string, string | null>
}

export function AdminProjectsList({ 
  projects, 
  allProjects,
  initialStatus = 'all',
  clientMap
}: AdminProjectsListProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // md breakpoint
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Force list view on mobile
  const effectiveViewMode = isMobile ? 'list' : viewMode

  if (projects && projects.length > 0) {
    return (
      <div className="space-y-4">
        {/* View Toggle - Hidden on mobile */}
        <div className="flex justify-end hidden md:flex">
          <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg border border-border">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              className="h-8 px-3"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="h-4 w-4 mr-2" />
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              className="h-8 px-3"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4 mr-2" />
              List
            </Button>
          </div>
        </div>

        {/* Projects */}
        {effectiveViewMode === 'grid' ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project}
                clientName={project.clientName}
                isAdmin={true}
                viewMode="grid"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {projects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project}
                clientName={project.clientName}
                isAdmin={true}
                viewMode="list"
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Card className="border-dashed border-border">
      <CardContent className="pt-12 pb-12 text-center">
        <p className="text-muted-foreground">
          No projects found.
        </p>
      </CardContent>
    </Card>
  )
}
