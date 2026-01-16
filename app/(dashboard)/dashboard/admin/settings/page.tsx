import { redirect } from 'next/navigation'
import { requireRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ContentTypesManager } from '@/components/admin/ContentTypesManager'
import { PlatformsManager } from '@/components/admin/PlatformsManager'
import { DurationsManager } from '@/components/admin/DurationsManager'
import { DimensionsManager } from '@/components/admin/DimensionsManager'

export default async function AdminSettingsPage() {
  const profile = await requireRole('admin')
  const supabase = await createClient()

  // Fetch all options
  const { data: contentTypes } = await supabase
    .from('content_types')
    .select('*')
    .order('name')

  const { data: platforms } = await supabase
    .from('platforms')
    .select('*')
    .order('name')

  const { data: durations } = await supabase
    .from('durations')
    .select('*')
    .order('seconds')

  const { data: dimensions } = await supabase
    .from('dimensions')
    .select('*')
    .order('label')

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage task options</p>
      </div>

      <Tabs defaultValue="content-types" className="w-full">
        <TabsList>
          <TabsTrigger value="content-types">Content Types</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="durations">Durations</TabsTrigger>
          <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
        </TabsList>
        <TabsContent value="content-types">
          <ContentTypesManager initialData={contentTypes || []} />
        </TabsContent>
        <TabsContent value="platforms">
          <PlatformsManager initialData={platforms || []} />
        </TabsContent>
        <TabsContent value="durations">
          <DurationsManager initialData={durations || []} />
        </TabsContent>
        <TabsContent value="dimensions">
          <DimensionsManager initialData={dimensions || []} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
