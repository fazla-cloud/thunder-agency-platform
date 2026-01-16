'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Search, Calendar, X } from 'lucide-react'

interface SearchFilterProps {
  placeholder?: string
  onSearch?: (query: string, dateFrom: string | null, dateTo: string | null) => void
  searchParamKey?: string
  dateFromParamKey?: string
  dateToParamKey?: string
}

export function SearchFilter({
  placeholder = 'Search...',
  onSearch,
  searchParamKey = 'search',
  dateFromParamKey = 'dateFrom',
  dateToParamKey = 'dateTo',
}: SearchFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get(searchParamKey) || '')
  const [dateFrom, setDateFrom] = useState(searchParams.get(dateFromParamKey) || '')
  const [dateTo, setDateTo] = useState(searchParams.get(dateToParamKey) || '')

  const handleFilter = () => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (searchQuery.trim()) {
      params.set(searchParamKey, searchQuery.trim())
    } else {
      params.delete(searchParamKey)
    }
    
    if (dateFrom) {
      params.set(dateFromParamKey, dateFrom)
    } else {
      params.delete(dateFromParamKey)
    }
    
    if (dateTo) {
      params.set(dateToParamKey, dateTo)
    } else {
      params.delete(dateToParamKey)
    }

    router.push(`?${params.toString()}`)
    
    if (onSearch) {
      onSearch(searchQuery.trim(), dateFrom || null, dateTo || null)
    }
  }

  const handleClear = () => {
    setSearchQuery('')
    setDateFrom('')
    setDateTo('')
    const params = new URLSearchParams(searchParams.toString())
    params.delete(searchParamKey)
    params.delete(dateFromParamKey)
    params.delete(dateToParamKey)
    router.push(`?${params.toString()}`)
    
    if (onSearch) {
      onSearch('', null, null)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleFilter()
    }
  }

  const hasFilters = searchQuery || dateFrom || dateTo

  return (
    <Card className="mb-6 border-border bg-card dark:bg-card">
      <CardContent className="pt-4 pb-4 px-4">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          {/* Search Input */}
          <div className="flex-1 w-full md:w-auto">
            <Label htmlFor="search" className="mb-2 block">Search:</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                type="text"
                placeholder={placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-9"
              />
            </div>
          </div>

          {/* Date From */}
          <div className="w-full md:w-auto">
            <Label htmlFor="dateFrom" className="mb-2 block">Date from:</Label>
            <div className="relative">
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="pr-9"
              />
            </div>
          </div>

          {/* Date To */}
          <div className="w-full md:w-auto">
            <Label htmlFor="dateTo" className="mb-2 block">Date to:</Label>
            <div className="relative">
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="pr-9"
              />
            </div>
          </div>

          {/* Filter Button */}
          <div className="flex gap-2">
            <Button onClick={handleFilter} className="whitespace-nowrap">
              Filter
            </Button>
            {hasFilters && (
              <Button
                variant="outline"
                onClick={handleClear}
                className="whitespace-nowrap"
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
