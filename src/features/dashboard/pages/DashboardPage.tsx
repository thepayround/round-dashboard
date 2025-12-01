import { motion } from 'framer-motion'
import {
  Building,
  Users,
  CheckCircle,
  Clock,
  DollarSign,
  ArrowUpRight,
  MapPin,
  Calendar,
  Building2,
  RefreshCw,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import {
  DashboardSkeleton,
  KPICard,
  RevenueChart,
  StatCard,
  DetailsList,
  AddressCard,
  UserCard,
} from '../components'
import { useDashboardPageController } from '../hooks/useDashboardPageController'
import type { DateRangePreset } from '../hooks/useDashboardPageController'

import { DashboardLayout } from '@/shared/layout/DashboardLayout'
import { SimpleSelect } from '@/shared/ui/SimpleSelect'
import { Alert, AlertDescription } from '@/shared/ui/shadcn/alert'
import { Badge } from '@/shared/ui/shadcn/badge'
import { Button } from '@/shared/ui/shadcn/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/shadcn/card'
import { sanitizeUrl } from '@/shared/utils/urlSanitization'

export const DashboardPage = () => {
  const navigate = useNavigate()
  const {
    isAuthLoading,
    isRoundAccountLoading,
    user,
    roundAccount,
    welcomeName,
    formatCurrency,
    filters,
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
  } = useDashboardPageController()

  // Loading state
  if (isAuthLoading || isRoundAccountLoading) {
    return (
      <DashboardLayout>
        <DashboardSkeleton />
      </DashboardLayout>
    )
  }

  // No user state
  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="max-w-md text-center">
            <CardContent className="pt-6">
              <p className="text-muted-foreground">
                Unable to load user data. Please try refreshing the page.
              </p>
              <Button
                onClick={() => window.location.reload()}
                variant="default"
                className="mt-4"
              >
                Refresh Page
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome back, {welcomeName}!
          </h1>
        </div>
        {roundAccount && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Badge
              variant="outline"
              className={
                roundAccount.status.toLowerCase() === 'active'
                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-4 py-2'
                  : 'bg-muted text-muted-foreground border-border px-4 py-2'
              }
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {roundAccount.status}
            </Badge>
          </motion.div>
        )}
      </div>

      <div className="space-y-6">
        {/* Performance Snapshot Card */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <CardTitle className="text-base font-medium">Performance Snapshot</CardTitle>
                <CardDescription>
                  {filterSummary.segmentLabel} • {filterSummary.dateRangeLabel}
                </CardDescription>
              </div>
              <div className="flex flex-wrap items-end gap-4">
                <SimpleSelect
                  label="Date range"
                  id="date-range"
                  options={dateRangeOptions.map((opt) => ({
                    value: opt.id,
                    label: opt.label,
                  }))}
                  value={filters.dateRange.preset}
                  onChange={(value) => handleDateRangeChange(value as DateRangePreset)}
                  className="w-[180px]"
                />
                <SimpleSelect
                  label="Segment"
                  id="segment"
                  options={segmentOptions.map((opt) => ({
                    value: opt.id,
                    label: opt.label,
                  }))}
                  value={filters.segmentId}
                  onChange={handleSegmentChange}
                  className="w-[180px]"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="default"
                  onClick={refreshMetrics}
                  disabled={isRefreshing}
                >
                  <RefreshCw
                    className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
                  />
                  {isRefreshing ? 'Refreshing...' : 'Refresh'}
                </Button>
              </div>
            </div>
          </CardHeader>
          {(isMetricsLoading || lastUpdated) && (
            <CardContent className="pt-0">
              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                {isMetricsLoading && (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    Refreshing metrics…
                  </span>
                )}
                {lastUpdated && (
                  <span>
                    Updated{' '}
                    {lastUpdated.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                )}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Error Alert */}
        {metricsError && (
          <Alert variant="destructive">
            <AlertDescription>{metricsError}</AlertDescription>
          </Alert>
        )}

        {/* KPI Cards */}
        {kpis.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {kpis.map((kpi) => (
              <KPICard
                key={kpi.id}
                label={kpi.label}
                value={kpi.formattedValue}
                delta={kpi.delta}
                trend={kpi.trend}
              />
            ))}
          </motion.div>
        )}

        {/* Revenue Chart */}
        {chartData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
          >
            <RevenueChart
              data={chartData}
              description={filterSummary.dateRangeLabel}
              segmentLabel={
                segmentOptions.find((option) => option.id === filters.segmentId)?.label ?? 'All'
              }
              formatCurrency={formatCurrency}
              currency={metricsCurrency}
            />
          </motion.div>
        )}

        {/* Quick Stats */}
        {roundAccount && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <StatCard
              label="Account type"
              value={roundAccount.accountType}
              icon={Building}
            />
            <StatCard
              label="Account status"
              value={roundAccount.status}
              icon={CheckCircle}
            />
            <StatCard
              label="Created date"
              value={new Date(roundAccount.createdDate).toLocaleDateString()}
              icon={Clock}
            />
            {roundAccount.organization?.currency && (
              <StatCard
                label="Currency"
                value={roundAccount.organization.currency}
                icon={DollarSign}
              />
            )}
          </motion.div>
        )}

        {/* Account & Organization Details */}
        {roundAccount && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <DetailsList
                title="Account Details"
                description="Core account information and settings"
                headerIcon={Building}
                items={[
                  {
                    icon: Building2,
                    label: 'Account Name',
                    value: roundAccount.accountName,
                  },
                  {
                    icon: Building,
                    label: 'Account ID',
                    value: roundAccount.roundAccountId,
                    mono: true,
                  },
                  {
                    icon: Building,
                    label: 'Type',
                    value: roundAccount.accountType,
                  },
                  {
                    icon: CheckCircle,
                    label: 'Status',
                    badge: {
                      text: roundAccount.status,
                      variant: roundAccount.status.toLowerCase() === 'active' ? 'success' : 'secondary',
                    },
                  },
                  {
                    icon: Calendar,
                    label: 'Created',
                    value: new Date(roundAccount.createdDate).toLocaleDateString(undefined, {
                      dateStyle: 'medium',
                    }),
                  },
                ]}
              />
            </motion.div>

            {roundAccount.organization && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <DetailsList
                  title="Organization Details"
                  description="Company information and settings"
                  headerIcon={Building2}
                  items={[
                    {
                      icon: Building2,
                      label: 'Name',
                      value: roundAccount.organization.name,
                    },
                    {
                      icon: DollarSign,
                      label: 'Org ID',
                      value: roundAccount.organization.organizationId,
                      mono: true,
                    },
                    {
                      icon: Building,
                      label: 'Type',
                      value: roundAccount.organization.type,
                    },
                    ...(roundAccount.organization.website
                      ? [
                          {
                            icon: ArrowUpRight,
                            label: 'Website',
                            value: (
                              <a
                                href={sanitizeUrl(roundAccount.organization.website)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:text-primary/80 transition-colors"
                              >
                                {roundAccount.organization.website}
                              </a>
                            ),
                          },
                        ]
                      : []),
                  ]}
                />
              </motion.div>
            )}
          </div>
        )}

        {/* Addresses Section */}
        {roundAccount?.roundAccountAddresses && roundAccount.roundAccountAddresses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-muted border border-border">
                    <MapPin className="w-5 h-5 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg font-medium">Account Addresses</CardTitle>
                    <CardDescription>Billing and shipping addresses</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {roundAccount.roundAccountAddresses.map((address) => (
                    <AddressCard key={address.addressId} address={address} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Users Section */}
        {roundAccount?.roundAccountUsers && roundAccount.roundAccountUsers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-muted border border-border">
                    <Users className="w-5 h-5 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg font-medium">Account Users</CardTitle>
                    <CardDescription>Team members with access to this account</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {roundAccount.roundAccountUsers.map((accountUser) => (
                    <UserCard
                      key={`${accountUser.roundAccountId}-${accountUser.userId}`}
                      user={accountUser}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* No Round Account Message */}
        {!roundAccount && !isRoundAccountLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="text-center">
              <CardContent className="pt-8 pb-8">
                <Building className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-medium tracking-tight text-foreground mb-2">
                  No Round Account Found
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  It looks like you don&apos;t have a Round account set up yet, or there was an
                  issue loading your account data.
                </p>
                <div className="flex items-center justify-center gap-4">
                  <Button onClick={() => navigate('/help')} variant="outline">
                    Contact Support
                  </Button>
                  <Button onClick={() => window.location.reload()} variant="default">
                    Refresh Page
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  )
}
