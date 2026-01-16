'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Edit, Trash2 } from 'lucide-react'

interface Platform {
  id: string
  name: string
  created_at: string
}

interface PlatformsManagerProps {
  initialData: Platform[]
}

export function PlatformsManager({ initialData }: PlatformsManagerProps) {
  const router = useRouter()
  const [items, setItems] = useState<Platform[]>(initialData)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Platform | null>(null)
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleAdd = async () => {
    if (!name.trim()) return
    setLoading(true)
    try {
      const { data, error } = await (supabase
        .from('platforms') as any)
        .insert({ name: name.trim() })
        .select()
        .single()

      if (error) throw error
      setItems([...items, data])
      setName('')
      setIsDialogOpen(false)
      router.refresh()
    } catch (err: any) {
      alert(err.message || 'Failed to add platform')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async () => {
    if (!editingItem || !name.trim()) return
    setLoading(true)
    try {
      const { error } = await (supabase
        .from('platforms') as any)
        .update({ name: name.trim() })
        .eq('id', editingItem.id)

      if (error) throw error
      setItems(items.map(item => item.id === editingItem.id ? { ...item, name: name.trim() } : item))
      setEditingItem(null)
      setName('')
      setIsDialogOpen(false)
      router.refresh()
    } catch (err: any) {
      alert(err.message || 'Failed to update platform')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    setLoading(true)
    try {
      const { error } = await (supabase
        .from('platforms') as any)
        .delete()
        .eq('id', id)

      if (error) throw error
      setItems(items.filter(item => item.id !== id))
      router.refresh()
    } catch (err: any) {
      alert(err.message || 'Failed to delete platform')
    } finally {
      setLoading(false)
    }
  }

  const openEditDialog = (item: Platform) => {
    setEditingItem(item)
    setName(item.name)
    setIsDialogOpen(true)
  }

  const openAddDialog = () => {
    setEditingItem(null)
    setName('')
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Platforms</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add Platform
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit' : 'Add'} Platform</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Instagram, Facebook"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={editingItem ? handleEdit : handleAdd} disabled={loading}>
                  {loading ? 'Saving...' : editingItem ? 'Update' : 'Add'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(item)}
                      disabled={loading}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
