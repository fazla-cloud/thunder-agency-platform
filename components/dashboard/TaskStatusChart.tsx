'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useTheme } from '@/components/theme/ThemeProvider'

interface TaskStatusChartProps {
  data: Array<{ status: string; count: number }>
}

const statusColorsLight: Record<string, string> = {
  new: 'hsl(0 0% 100%)',
  accepted: 'hsl(0 0% 95%)',
  in_progress: 'hsl(0 0% 90%)',
  completed: 'hsl(0 0% 95%)',
}

const statusColorsDark: Record<string, string> = {
  new: 'hsl(0 0% 5%)',
  accepted: 'hsl(0 0% 5%)',
  in_progress: 'hsl(0 0% 10%)',
  completed: 'hsl(0 0% 5%)',
}

const statusLabels: Record<string, string> = {
  new: 'New',
  accepted: 'Accepted',
  in_progress: 'In Progress',
  completed: 'Completed',
}

export function TaskStatusChart({ data }: TaskStatusChartProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const statusColors = isDark ? statusColorsDark : statusColorsLight
  
  const gridColor = isDark ? 'hsl(0 0% 10%)' : 'hsl(0 0% 90%)'
  const axisColor = isDark ? 'hsl(0 0% 70%)' : 'hsl(0 0% 30%)'
  const tooltipBg = isDark ? 'hsl(0 0% 5%)' : 'hsl(0 0% 100%)'
  const tooltipBorder = isDark ? 'hsl(0 0% 10%)' : 'hsl(0 0% 90%)'

  // Always show chart even if all values are 0 - transform data for chart
  const chartData = (data && data.length > 0 ? data : []).map(item => ({
    ...item,
    name: statusLabels[item.status] || item.status,
    fill: statusColors[item.status] || (isDark ? 'hsl(0 0% 5%)' : 'hsl(0 0% 100%)'),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Task Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis 
              dataKey="name" 
              stroke={axisColor}
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke={axisColor}
              style={{ fontSize: '12px' }}
              domain={[0, 'auto']}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: tooltipBg,
                border: `1px solid ${tooltipBorder}`,
                borderRadius: '0.5rem',
                color: isDark ? 'hsl(0 0% 95%)' : 'hsl(0 0% 5%)',
              }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
