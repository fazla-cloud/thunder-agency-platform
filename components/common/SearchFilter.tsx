'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Search, Calendar, X, Filter } from 'lucide-react'

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
  const [filterDialogOpen, setFilterDialogOpen] = useState(false)

  const applyFilters = () => {
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

  const handleFilter = () => {
    applyFilters()
    setFilterDialogOpen(false)
  }

  const handleMobileFilterClick = () => {
    setFilterDialogOpen(true)
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
    <>
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

            {/* Date From - Hidden on mobile */}
            <div className="w-full md:w-auto hidden md:block">
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

            {/* Date To - Hidden on mobile */}
            <div className="w-full md:w-auto hidden md:block">
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
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <Button 
                onClick={handleFilter} 
                className="whitespace-nowrap hidden md:inline-flex"
              >
                Filter
              </Button>
              <Button 
                onClick={handleMobileFilterClick} 
                className="whitespace-nowrap md:hidden w-full"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              {hasFilters && (
                <Button
                  variant="outline"
                  onClick={handleClear}
                  className="whitespace-nowrap w-full sm:w-auto"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter Dialog for Mobile */}
      <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Filter Options</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Date From */}
            <div className="space-y-2">
              <Label htmlFor="dialogDateFrom">Date from:</Label>
              <div className="relative">
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="dialogDateFrom"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="pr-9"
                />
              </div>
            </div>

            {/* Date To */}
            <div className="space-y-2">
              <Label htmlFor="dialogDateTo">Date to:</Label>
              <div className="relative">
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="dialogDateTo"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="pr-9"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setFilterDialogOpen(false)}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setDateFrom('')
                setDateTo('')
              }}
              className="w-full sm:w-auto order-1 sm:order-2"
            >
              <X className="h-4 w-4 mr-1" />
              Clear Dates
            </Button>
            <Button 
              onClick={handleFilter} 
              className="w-full sm:w-auto order-3"
            >
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
