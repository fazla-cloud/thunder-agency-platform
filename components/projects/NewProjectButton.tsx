'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { NewProjectDialog } from './NewProjectDialog'

interface NewProjectButtonProps {
  clientId: string
  variant?: 'default' | 'outline' | 'ghost'
  className?: string
}

export function NewProjectButton({ clientId, variant = 'default', className }: NewProjectButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)} variant={variant} className={className}>
        <Plus className="mr-2 h-4 w-4" />
        New Project
      </Button>
      <NewProjectDialog
        clientId={clientId}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  )
}
