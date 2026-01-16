'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useTheme } from '@/components/theme/ThemeProvider'

interface TasksByPlatformChartProps {
  data: Array<{ platform: string; count: number }>
}

const colorsLight = [
  'hsl(0 0% 5%)',
  'hsl(0 0% 20%)',
  'hsl(0 0% 35%)',
  'hsl(0 0% 50%)',
  'hsl(0 0% 65%)',
]

const colorsDark = [
  'hsl(0 0% 95%)',
  'hsl(0 0% 80%)',
  'hsl(0 0% 65%)',
  'hsl(0 0% 50%)',
  'hsl(0 0% 35%)',
]

export function TasksByPlatformChart({ data }: TasksByPlatformChartProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const colors = isDark ? colorsDark : colorsLight
  
  const gridColor = isDark ? 'hsl(0 0% 10%)' : 'hsl(0 0% 90%)'
  const axisColor = isDark ? 'hsl(0 0% 70%)' : 'hsl(0 0% 30%)'
  const tooltipBg = isDark ? 'hsl(0 0% 5%)' : 'hsl(0 0% 100%)'
  const tooltipBorder = isDark ? 'hsl(0 0% 10%)' : 'hsl(0 0% 90%)'

  // Always show chart even if empty - transform data for chart
  const chartData = (data && data.length > 0 ? data : []).map((item, index) => ({
    ...item,
    fill: colors[index % colors.length],
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Tasks by Platform</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis 
                type="number"
                stroke={axisColor}
                style={{ fontSize: '12px' }}
                domain={[0, 'auto']}
              />
              <YAxis 
                type="category"
                dataKey="platform"
                stroke={axisColor}
                style={{ fontSize: '12px' }}
                width={100}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: tooltipBg,
                  border: `1px solid ${tooltipBorder}`,
                  borderRadius: '0.5rem',
                  color: isDark ? 'hsl(0 0% 95%)' : 'hsl(0 0% 5%)',
                }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No data available
          </div>
        )}
      </CardContent>
    </Card>
  )
}
