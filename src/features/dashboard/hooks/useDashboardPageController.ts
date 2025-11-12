import { useCallback, useEffect, useMemo, useState } from 'react'

import { useAuth } from '@/shared/hooks/useAuth'
import { useCurrency } from '@/shared/hooks/useCurrency'
import { useRoundAccount } from '@/shared/hooks/useRoundAccount'
import type { RoundAccountInfo } from '@/shared/services/api/roundAccount.service'
import type { User } from '@/shared/types/auth'

const DAY_IN_MS = 86_400_000
const POLLING_INTERVAL_MS = 60_000

export type DateRangePreset = '7d' | '30d' | '90d' | '365d'

interface DateRange {
  preset: DateRangePreset
  start: Date
  end: Date
}

interface SegmentOption {
  id: string
  label: string
  description: string
}

interface DashboardKpi {
  id: string
  label: string
  formattedValue: string
  delta: number
  trend: 'up' | 'down' | 'flat'
}

interface ChartPoint {
  label: string
  primaryValue: number
  goalValue: number
}

interface DashboardMetrics {
  currency: string
  activeCustomers: number
  activeCustomersDelta: number
  newCustomers: number
  newCustomersDelta: number
  mrr: number
  mrrDelta: number
  churnRate: number
  churnRateDelta: number
  revenueTrend: ChartPoint[]
}

interface FilterSummary {
  dateRangeLabel: string
  segmentLabel: string
}

const DATE_PRESET_CONFIG: Record<DateRangePreset, { label: string; days: number }> = {
  '7d': { label: 'Last 7 days', days: 7 },
  '30d': { label: 'Last 30 days', days: 30 },
  '90d': { label: 'Last 90 days', days: 90 },
  '365d': { label: 'Last 12 months', days: 365 },
}

const SEGMENT_OPTIONS: SegmentOption[] = [
  { id: 'all', label: 'All customers', description: 'Entire customer base across segments' },
  { id: 'enterprise', label: 'Enterprise', description: 'Large organizations and premium plans' },
  { id: 'smb', label: 'SMB', description: 'Small and medium sized businesses' },
  { id: 'startup', label: 'Startups', description: 'Early stage and self-serve customers' },
]

const SEGMENT_MULTIPLIERS: Record<string, number> = {
  all: 1,
  enterprise: 1.25,
  smb: 0.9,
  startup: 1.15,
}

const buildRangeFromPreset = (preset: DateRangePreset): DateRange => {
  const end = new Date()
  const start = new Date(end)
  const days = DATE_PRESET_CONFIG[preset]?.days ?? 30
  start.setDate(end.getDate() - (days - 1))

  return { preset, start, end }
}

const formatRangeLabel = (range: DateRange): string => {
  const formatter = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  return `${formatter.format(range.start)} – ${formatter.format(range.end)}`
}

const buildRevenueTrend = (range: DateRange, normalizedRevenue: number, multiplier: number): ChartPoint[] => {
  const totalDays = Math.max(1, Math.round((range.end.getTime() - range.start.getTime()) / DAY_IN_MS) + 1)
  const bucketCount = Math.min(12, totalDays)
  const bucketSize = totalDays / bucketCount

  const basePointValue = normalizedRevenue / bucketCount

  return Array.from({ length: bucketCount }, (_, index) => {
    const bucketStart = new Date(range.start.getTime() + DAY_IN_MS * bucketSize * index)
    const noise = Math.sin((index + 1) * 0.9) * 0.08
    const growth = (index / bucketCount) * 0.12
    const primaryValue = Math.max(0, basePointValue * (1 + noise + growth + (multiplier - 1) * 0.1))
    const goalValue = basePointValue * (1 + growth)

    return {
      label: bucketStart.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      primaryValue,
      goalValue,
    }
  })
}

const synthesizeMetrics = ({
  roundAccount,
  dateRange,
  segmentId,
}: {
  roundAccount: RoundAccountInfo | null
  dateRange: DateRange
  segmentId: string
}): DashboardMetrics => {
  const currency = roundAccount?.organization?.currency ?? 'USD'
  const baseRevenue = roundAccount?.organization?.revenue ?? 240_000
  const multiplier = SEGMENT_MULTIPLIERS[segmentId] ?? 1

  const rangeDays = Math.max(1, Math.round((dateRange.end.getTime() - dateRange.start.getTime()) / DAY_IN_MS) + 1)
  const rangeMultiplier = Math.min(1.6, Math.max(0.5, rangeDays / 30))
  const normalizedRevenue = baseRevenue * multiplier * rangeMultiplier

  const mrr = normalizedRevenue / 12
  const activeCustomers = Math.round(Math.max(25, normalizedRevenue / 1500))
  const newCustomers = Math.round(Math.max(5, activeCustomers * 0.08 * rangeMultiplier))
  const churnRate = Math.max(0.4, 2.6 - (multiplier - 1) * 3)

  return {
    currency,
    activeCustomers,
    activeCustomersDelta: Math.round((multiplier - 1) * 8),
    newCustomers,
    newCustomersDelta: Math.round((rangeMultiplier - 1) * 12),
    mrr,
    mrrDelta: Math.round((multiplier - 1) * 6 * 100) / 100,
    churnRate,
    churnRateDelta: Math.round((1 - multiplier) * 5 * 100) / 100,
    revenueTrend: buildRevenueTrend(dateRange, normalizedRevenue, multiplier),
  }
}

const computeWelcomeName = (user: User | null): string => {
  if (!user) return 'User'
  const first = user.firstName?.trim()
  const last = user.lastName?.trim()

  if (first && last) return `${first} ${last}`
  if (first) return first
  return user.email ?? 'User'
}

export const useDashboardPageController = () => {
  const { state } = useAuth()
  const { user, isLoading: isAuthLoading } = state
  const { roundAccount, isLoading: isRoundAccountLoading } = useRoundAccount()
  const { formatCurrency } = useCurrency()

  const [dateRange, setDateRange] = useState<DateRange>(() => buildRangeFromPreset('30d'))
  const [segmentId, setSegmentId] = useState<string>('all')
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [metricsError, setMetricsError] = useState<string | null>(null)
  const [isMetricsLoading, setIsMetricsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const dateRangeOptions = useMemo(
    () =>
      (Object.entries(DATE_PRESET_CONFIG) as Array<[DateRangePreset, { label: string }]>).map(([id, meta]) => ({
        id,
        label: meta.label,
      })),
    []
  )

  const segmentOptions = useMemo(() => SEGMENT_OPTIONS, [])

  const filterSummary: FilterSummary = useMemo(() => {
    const segmentLabel = segmentOptions.find(option => option.id === segmentId)?.label ?? segmentOptions[0].label

    return {
      dateRangeLabel: formatRangeLabel(dateRange),
      segmentLabel,
    }
  }, [dateRange, segmentId, segmentOptions])

  const fetchMetrics = useCallback(
    async ({ silent = false }: { silent?: boolean } = {}) => {
      if (!silent) {
        setIsMetricsLoading(true)
      }

      setMetricsError(null)

      try {
        const nextMetrics = synthesizeMetrics({
          roundAccount,
          dateRange,
          segmentId,
        })
        setMetrics(nextMetrics)
        setLastUpdated(new Date())
      } catch (error) {
        console.error('Failed to compute dashboard metrics', error)
        setMetricsError('Unable to load dashboard metrics right now. Please try again shortly.')
      } finally {
        if (!silent) {
          setIsMetricsLoading(false)
        }
      }
    },
    [dateRange, roundAccount, segmentId]
  )

  useEffect(() => {
    if (isRoundAccountLoading) {
      return
    }

    fetchMetrics()
  }, [fetchMetrics, isRoundAccountLoading])

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchMetrics({ silent: true })
    }, POLLING_INTERVAL_MS)

    return () => clearInterval(intervalId)
  }, [fetchMetrics])

  const handleDateRangeChange = useCallback((preset: DateRangePreset) => {
    setDateRange(buildRangeFromPreset(preset))
  }, [])

  const handleSegmentChange = useCallback((nextSegmentId: string) => {
    setSegmentId(nextSegmentId)
  }, [])

  const refreshMetrics = useCallback(async () => {
    setIsRefreshing(true)
    try {
      await fetchMetrics({ silent: true })
    } finally {
      setIsRefreshing(false)
    }
  }, [fetchMetrics])

  const kpis: DashboardKpi[] = useMemo(() => {
    if (!metrics) {
      return []
    }

    return [
      {
        id: 'activeCustomers',
        label: 'Active Customers',
        formattedValue: metrics.activeCustomers.toLocaleString(),
        delta: metrics.activeCustomersDelta,
        trend: metrics.activeCustomersDelta > 0 ? 'up' : metrics.activeCustomersDelta < 0 ? 'down' : 'flat',
      },
      {
        id: 'newCustomers',
        label: 'New Customers',
        formattedValue: metrics.newCustomers.toLocaleString(),
        delta: metrics.newCustomersDelta,
        trend: metrics.newCustomersDelta > 0 ? 'up' : metrics.newCustomersDelta < 0 ? 'down' : 'flat',
      },
      {
        id: 'mrr',
        label: 'Monthly Recurring Revenue',
        formattedValue: formatCurrency(metrics.mrr, metrics.currency),
        delta: metrics.mrrDelta,
        trend: metrics.mrrDelta > 0 ? 'up' : metrics.mrrDelta < 0 ? 'down' : 'flat',
      },
      {
        id: 'churnRate',
        label: 'Churn Rate',
        formattedValue: `${metrics.churnRate.toFixed(2)}%`,
        delta: metrics.churnRateDelta,
        trend: metrics.churnRateDelta < 0 ? 'up' : metrics.churnRateDelta > 0 ? 'down' : 'flat',
      },
    ]
  }, [formatCurrency, metrics])

  const chartData: ChartPoint[] = useMemo(() => metrics?.revenueTrend ?? [], [metrics])

  const metricsCurrency = metrics?.currency ?? roundAccount?.organization?.currency ?? 'USD'

  return {
    isAuthLoading,
    isRoundAccountLoading,
    user,
    roundAccount,
    welcomeName: computeWelcomeName(user),
    formatCurrency,
    filters: {
      dateRange,
      segmentId,
    },
    filterSummary,
    dateRangeOptions,
    segmentOptions,
    handleDateRangeChange,
    handleSegmentChange,
    refreshMetrics,
    isRefreshing,
    isMetricsLoading,
    metricsError,
    kpis,
    chartData,
    metricsCurrency,
    lastUpdated,
  }
}
