'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { NewTaskDialog } from './NewTaskDialog'

interface NewTaskButtonProps {
  clientId: string
  projectId?: string
  variant?: 'default' | 'outline' | 'ghost'
  className?: string
}

export function NewTaskButton({ 
  clientId, 
  projectId,
  variant = 'default', 
  className 
}: NewTaskButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)} variant={variant} className={className}>
        <Plus className="mr-2 h-4 w-4" />
        {projectId ? 'New Task' : 'New Task'}
      </Button>
      <NewTaskDialog
        clientId={clientId}
        projectId={projectId}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  )
}
