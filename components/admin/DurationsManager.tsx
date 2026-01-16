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

interface Duration {
  id: string
  label: string
  seconds: number
  created_at: string
}

interface DurationsManagerProps {
  initialData: Duration[]
}

export function DurationsManager({ initialData }: DurationsManagerProps) {
  const router = useRouter()
  const [items, setItems] = useState<Duration[]>(initialData)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Duration | null>(null)
  const [label, setLabel] = useState('')
  const [seconds, setSeconds] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleAdd = async () => {
    if (!label.trim() || !seconds) return
    setLoading(true)
    try {
      const { data, error } = await (supabase
        .from('durations') as any)
        .insert({ label: label.trim(), seconds })
        .select()
        .single()

      if (error) throw error
      setItems([...items, data].sort((a, b) => a.seconds - b.seconds))
      setLabel('')
      setSeconds(0)
      setIsDialogOpen(false)
      router.refresh()
    } catch (err: any) {
      alert(err.message || 'Failed to add duration')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async () => {
    if (!editingItem || !label.trim() || !seconds) return
    setLoading(true)
    try {
      const { error } = await (supabase
        .from('durations') as any)
        .update({ label: label.trim(), seconds })
        .eq('id', editingItem.id)

      if (error) throw error
      setItems(items.map(item => item.id === editingItem.id ? { ...item, label: label.trim(), seconds } : item).sort((a, b) => a.seconds - b.seconds))
      setEditingItem(null)
      setLabel('')
      setSeconds(0)
      setIsDialogOpen(false)
      router.refresh()
    } catch (err: any) {
      alert(err.message || 'Failed to update duration')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    setLoading(true)
    try {
      const { error } = await (supabase
        .from('durations') as any)
        .delete()
        .eq('id', id)

      if (error) throw error
      setItems(items.filter(item => item.id !== id))
      router.refresh()
    } catch (err: any) {
      alert(err.message || 'Failed to delete duration')
    } finally {
      setLoading(false)
    }
  }

  const openEditDialog = (item: Duration) => {
    setEditingItem(item)
    setLabel(item.label)
    setSeconds(item.seconds)
    setIsDialogOpen(true)
  }

  const openAddDialog = () => {
    setEditingItem(null)
    setLabel('')
    setSeconds(0)
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Durations</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add Duration
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit' : 'Add'} Duration</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="label">Label</Label>
                <Input
                  id="label"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="e.g., 30 seconds"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seconds">Seconds</Label>
                <Input
                  id="seconds"
                  type="number"
                  value={seconds}
                  onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
                  placeholder="30"
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
              <TableHead>Label</TableHead>
              <TableHead>Seconds</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.label}</TableCell>
                <TableCell>{item.seconds}</TableCell>
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
