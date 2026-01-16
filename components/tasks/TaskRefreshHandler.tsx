'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface TaskRefreshHandlerProps {
  refreshInterval?: number
}

export function TaskRefreshHandler({ refreshInterval = 30000 }: TaskRefreshHandlerProps) {
  const router = useRouter()

  useEffect(() => {
    // Refresh data every 30 seconds to catch updates from admin
    const interval = setInterval(() => {
      router.refresh()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [router, refreshInterval])

  return null
}
