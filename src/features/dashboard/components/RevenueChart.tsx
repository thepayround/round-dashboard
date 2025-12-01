"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/shadcn/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/shared/ui/shadcn/chart'

export interface ChartDataPoint {
  label: string
  primaryValue: number
  goalValue: number
}

interface RevenueChartProps {
  data: ChartDataPoint[]
  title?: string
  description?: string
  segmentLabel?: string
  formatCurrency: (amount: number, currency: string) => string
  currency: string
}

const chartConfig = {
  primaryValue: {
    label: 'Actual',
    color: 'hsl(var(--primary))',
  },
  goalValue: {
    label: 'Goal',
    color: 'hsl(var(--muted-foreground))',
  },
} satisfies ChartConfig

/**
 * RevenueChart - Bar chart showing revenue vs goal using shadcn chart
 * Built with Recharts and shadcn chart wrapper for consistent styling
 */
export const RevenueChart = ({
  data,
  title = 'Revenue Trend',
  description,
  segmentLabel = 'All',
  formatCurrency,
  currency,
}: RevenueChartProps) => {
  // Transform data for Recharts
  const chartData = data.map((point) => ({
    name: point.label,
    primaryValue: point.primaryValue,
    goalValue: point.goalValue,
  }))

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between pb-2">
        <div>
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          {description && (
            <CardDescription>{description}</CardDescription>
          )}
        </div>
        <div className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full border border-border">
          Goal vs. actual ({segmentLabel})
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              className="text-xs"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => formatCurrency(value, currency)}
              className="text-xs"
              width={80}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => (
                    <div className="flex items-center justify-between gap-8">
                      <span className="text-muted-foreground">
                        {name === 'primaryValue' ? 'Actual' : 'Goal'}
                      </span>
                      <span className="font-mono font-medium">
                        {formatCurrency(Number(value), currency)}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="goalValue"
              fill="var(--color-goalValue)"
              radius={[4, 4, 0, 0]}
              opacity={0.3}
            />
            <Bar
              dataKey="primaryValue"
              fill="var(--color-primaryValue)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
