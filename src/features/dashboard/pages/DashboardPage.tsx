import { motion } from 'framer-motion'
import {
  User,
  Building,
  Users,
  CheckCircle,
  Clock,
  DollarSign,
  ArrowUpRight,
  MapPin,
  Calendar,
  Building2
} from 'lucide-react'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { useDashboardPageController } from '../hooks/useDashboardPageController'
import type { DateRangePreset } from '../hooks/useDashboardPageController'

import { DashboardLayout } from '@/shared/layout/DashboardLayout'
import { Alert, LoadingSpinner, UiDropdown, PageHeader } from '@/shared/ui'
import { ActionButton } from '@/shared/ui/ActionButton'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
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

  const maxChartValue = useMemo(
    () =>
      chartData.reduce(
        (acc, point) => Math.max(acc, point.primaryValue, point.goalValue),
        0
      ) || 1,
    [chartData]
  )

  if (isAuthLoading || isRoundAccountLoading) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2">
              <LoadingSpinner size="md" label="Loading your account..." />
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <div className="text-center">
            <p className="auth-text-muted">
              Unable to load user data. Please try refreshing the page.
            </p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <PageHeader
        title={`Welcome back, ${welcomeName}!`}
        actions={
          roundAccount && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full border ${roundAccount.status.toLowerCase() === 'active'
                  ? 'bg-success/10 border-success/20'
                  : 'bg-fg-muted/10 border-fg-muted/20'
                }`}
            >
              <CheckCircle
                className={`w-5 h-5 ${roundAccount.status.toLowerCase() === 'active' ? 'text-success' : 'text-fg-muted'
                  }`}
              />
              <span
                className={`font-medium tracking-tight text-sm ${roundAccount.status.toLowerCase() === 'active' ? 'text-success' : 'text-fg-muted'
                  }`}
              >
                {roundAccount.status}
              </span>
            </motion.div>
          )
        }
      />
      <div className="space-y-8">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-fg">Performance snapshot</p>
              <p className="text-xs text-fg-muted">
                {filterSummary.segmentLabel} • {filterSummary.dateRangeLabel}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <UiDropdown
                  label="Date range"
                  options={dateRangeOptions.map(opt => ({ value: opt.id, label: opt.label }))}
                  value={filters.dateRange.preset}
                  onSelect={(value: string) => handleDateRangeChange(value as DateRangePreset)}
                  allowSearch={false}
                />
              </div>
              <div>
                <UiDropdown
                  label="Segment"
                  options={segmentOptions.map(opt => ({ value: opt.id, label: opt.label }))}
                  value={filters.segmentId}
                  onSelect={handleSegmentChange}
                  allowSearch={false}
                />
              </div>
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={refreshMetrics}
                isLoading={isRefreshing}
              >
                Refresh
              </Button>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-fg-muted">
            {isMetricsLoading && (
              <LoadingSpinner size="xs" label="Refreshing metrics…" className="text-fg-muted" />
            )}
            {lastUpdated && (
              <span>Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            )}
          </div>
        </div>
        {metricsError && (
          <Alert
            variant="error"
            description={metricsError}
          />
        )}

        {kpis.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {kpis.map(kpi => (
              <Card key={kpi.id} padding="lg" className="relative overflow-hidden">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-fg-muted">{kpi.label}</p>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full border ${kpi.trend === 'up'
                        ? 'text-success bg-success/5 border-success/20'
                        : kpi.trend === 'down'
                          ? 'text-destructive bg-destructive/5 border-destructive/20'
                          : 'text-fg-muted bg-fg-muted/5 border-fg-muted/20'
                        }`}
                    >
                      {kpi.delta > 0 ? '+' : ''}{kpi.delta}%
                    </span>
                  </div>
                  <div>
                    <p className="text-3xl font-medium tracking-tight text-fg">{kpi.formattedValue}</p>
                  </div>
                </div>
              </Card>
            ))}
          </motion.div>
        )}

        {chartData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
          >
            <Card padding="lg">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <h3 className="text-base font-medium text-fg">Revenue trend</h3>
                  <p className="text-sm text-fg-muted">{filterSummary.dateRangeLabel}</p>
                </div>
                <div className="text-xs text-fg-muted bg-bg-raised px-3 py-1.5 rounded-full border border-border">
                  Goal vs. actual ({segmentOptions.find(option => option.id === filters.segmentId)?.label ?? 'All'})
                </div>
              </div>
              <div className="space-y-5">
                {chartData.map(point => {
                  const primaryWidth = Math.max(6, (point.primaryValue / maxChartValue) * 100)
                  const goalWidth = Math.max(6, (point.goalValue / maxChartValue) * 100)

                  return (
                    <div key={point.label}>
                      <div className="flex items-center justify-between text-xs font-medium text-fg-muted mb-2">
                        <span>{point.label}</span>
                        <span className="text-fg">{formatCurrency(point.primaryValue, metricsCurrency)}</span>
                      </div>
                      <div className="relative h-2 rounded-full bg-bg-raised overflow-hidden">
                        <div
                          className="absolute inset-y-0 left-0 rounded-full bg-border/30"
                          style={{ width: `${goalWidth}%` }}
                        />
                        <div
                          className="absolute inset-y-0 left-0 rounded-full bg-primary shadow-[0_0_15px_rgba(var(--primary),0.4)]"
                          style={{ width: `${primaryWidth}%` }}
                        />
                      </div>
                      <div className="mt-1.5 flex items-center justify-between text-[11px] text-fg-muted">
                        <span>Goal: {formatCurrency(point.goalValue, metricsCurrency)}</span>
                        <span className={point.primaryValue >= point.goalValue ? 'text-success' : 'text-destructive'}>
                          Δ {(point.primaryValue - point.goalValue).toFixed(0)}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Round Account Quick Stats */}
        {roundAccount && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {/* Account Type */}
            <Card padding="md">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-fg-muted text-xs font-medium tracking-tight mb-1">Account type</div>
                  <div className="text-fg text-sm font-medium tracking-tight">{roundAccount.accountType}</div>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                  <Building className="w-4 h-4 text-primary" />
                </div>
              </div>
            </Card>

            {/* Account Status */}
            <Card padding="md">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-fg-muted text-xs font-medium tracking-tight mb-1">Account status</div>
                  <div className="text-fg text-sm font-medium tracking-tight">{roundAccount.status}</div>
                </div>
                <div className="p-2 bg-success/10 rounded-lg border border-success/20">
                  <CheckCircle className="w-4 h-4 text-success" />
                </div>
              </div>
            </Card>

            {/* Created Date */}
            <Card padding="md">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-fg-muted text-xs font-medium tracking-tight mb-1">Created date</div>
                  <div className="text-fg text-sm font-medium tracking-tight">
                    {new Date(roundAccount.createdDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="p-2 bg-secondary/10 rounded-lg border border-secondary/20">
                  <Clock className="w-4 h-4 text-secondary" />
                </div>
              </div>
            </Card>

            {/* Currency */}
            {roundAccount.organization?.currency && (
              <Card padding="md">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-fg-muted text-xs font-medium tracking-tight mb-1">Currency</div>
                    <div className="text-fg text-sm font-medium tracking-tight">{roundAccount.organization.currency}</div>
                  </div>
                  <div className="p-2 bg-accent/10 rounded-lg border border-accent/20">
                    <DollarSign className="w-4 h-4 text-accent" />
                  </div>
                </div>
              </Card>
            )}
          </motion.div>
        )}

        {/* Main Content Grid */}
        {roundAccount && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Account Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card padding="lg">
                <div className="flex items-start gap-3 mb-6">
                  <div className="p-2 bg-secondary/10 rounded-lg border border-secondary/20">
                    <Building className="w-5 h-5 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-medium tracking-tight text-fg mb-1">Account details</h2>
                    <p className="text-fg-muted text-sm leading-snug">Core account information and settings</p>
                  </div>
                </div>

                <div className="divide-y divide-border/40 border border-border/40 rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between p-4 bg-bg-raised/50">
                    <div className="flex items-center gap-3">
                      <Building2 className="w-4 h-4 text-secondary" />
                      <span className="text-sm text-fg-muted">Account Name</span>
                    </div>
                    <span className="text-sm font-medium text-fg">{roundAccount.accountName}</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-bg-raised/50">
                    <div className="flex items-center gap-3">
                      <Building className="w-4 h-4 text-primary" />
                      <span className="text-sm text-fg-muted">Account ID</span>
                    </div>
                    <span className="text-sm font-mono text-fg">{roundAccount.roundAccountId}</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-bg-raised/50">
                    <div className="flex items-center gap-3">
                      <Building className="w-4 h-4 text-secondary" />
                      <span className="text-sm text-fg-muted">Type</span>
                    </div>
                    <span className="text-sm font-medium text-fg">{roundAccount.accountType}</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-bg-raised/50">
                    <div className="flex items-center gap-3">
                      <CheckCircle className={`w-4 h-4 ${roundAccount.status.toLowerCase() === 'active' ? 'text-success' : 'text-fg-muted'}`} />
                      <span className="text-sm text-fg-muted">Status</span>
                    </div>
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium border ${roundAccount.status.toLowerCase() === 'active'
                      ? 'bg-success/10 text-success border-success/20'
                      : 'bg-fg-muted/10 text-fg-muted border-fg-muted/20'
                      }`}>
                      {roundAccount.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-bg-raised/50">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-accent" />
                      <span className="text-sm text-fg-muted">Created</span>
                    </div>
                    <span className="text-sm font-medium text-fg">
                      {new Date(roundAccount.createdDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Organization Details */}
            {roundAccount.organization && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card padding="lg">
                  <div className="flex items-start gap-3 mb-6">
                    <div className="p-2 bg-accent/10 rounded-lg border border-accent/20">
                      <Building className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-medium tracking-tight text-fg mb-1">Organization details</h2>
                      <p className="text-fg-muted text-sm leading-snug">Company information and settings</p>
                    </div>
                  </div>

                  <div className="divide-y divide-border/40 border border-border/40 rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between p-4 bg-bg-raised/50">
                      <div className="flex items-center gap-3">
                        <Building2 className="w-4 h-4 text-primary" />
                        <span className="text-sm text-fg-muted">Name</span>
                      </div>
                      <span className="text-sm font-medium text-fg">{roundAccount.organization.name}</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-bg-raised/50">
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-4 h-4 text-success" />
                        <span className="text-sm text-fg-muted">Org ID</span>
                      </div>
                      <span className="text-sm font-mono text-fg">{roundAccount.organization.organizationId}</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-bg-raised/50">
                      <div className="flex items-center gap-3">
                        <Building className="w-4 h-4 text-secondary" />
                        <span className="text-sm text-fg-muted">Type</span>
                      </div>
                      <span className="text-sm font-medium text-fg">{roundAccount.organization.type}</span>
                    </div>

                    {roundAccount.organization.website && (
                      <div className="flex items-center justify-between p-4 bg-bg-raised/50">
                        <div className="flex items-center gap-3">
                          <ArrowUpRight className="w-4 h-4 text-secondary" />
                          <span className="text-sm text-fg-muted">Website</span>
                        </div>
                        <a
                          href={sanitizeUrl(roundAccount.organization.website)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                        >
                          {roundAccount.organization.website}
                        </a>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}
          </div>
        )}

        {/* Addresses Section */}
        {roundAccount?.roundAccountAddresses && roundAccount.roundAccountAddresses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card padding="lg">
              <div className="flex items-start gap-3 mb-6">
                <div className="p-2 bg-accent/10 rounded-lg border border-accent/20">
                  <MapPin className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-medium text-fg mb-1">Account Addresses</h2>
                  <p className="text-fg-muted text-sm leading-snug">Billing and shipping addresses</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roundAccount.roundAccountAddresses.map((address) => (
                  <div
                    key={address.addressId}
                    className="p-4 rounded-lg border border-border bg-bg-raised/50 hover:border-border/80 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-fg-muted" />
                        <h3 className="font-medium text-fg text-sm">{address.name}</h3>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-[10px] px-1.5 py-0.5 rounded border bg-bg text-fg-muted border-border uppercase tracking-wider font-medium">
                          {address.addressType}
                        </span>
                        {address.isPrimary && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded border bg-success/10 text-success border-success/20 uppercase tracking-wider font-medium">
                            Primary
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-fg-muted text-sm leading-relaxed pl-6">
                      <p>{address.number} {address.addressLine1}</p>
                      {address.addressLine2 && <p>{address.addressLine2}</p>}
                      <p>{address.city}, {address.state} {address.zipCode}</p>
                      <p>{address.country}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Users Section */}
        {roundAccount?.roundAccountUsers && roundAccount.roundAccountUsers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card padding="lg">
              <div className="flex items-start gap-3 mb-6">
                <div className="p-2 bg-secondary/10 rounded-lg border border-secondary/20">
                  <Users className="w-5 h-5 text-secondary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-medium text-fg mb-1">Account Users</h2>
                  <p className="text-fg-muted text-sm leading-snug">Team members with access to this account</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roundAccount.roundAccountUsers.map((accountUser) => (
                  <div
                    key={`${accountUser.roundAccountId}-${accountUser.userId}`}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border bg-bg-raised/50 hover:border-border/80 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-bg flex items-center justify-center flex-shrink-0 border border-border text-fg-muted">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="text-xs font-medium text-fg-muted">User ID</p>
                        {accountUser.role && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded border bg-secondary/10 text-secondary border-secondary/20 uppercase tracking-wider font-medium">
                            {accountUser.role}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-mono text-fg truncate" title={accountUser.userId}>
                        {accountUser.userId}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
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
            <Card padding="xl">
              <div className="text-center">
                <Building className="w-16 h-16 text-fg-muted mx-auto mb-4" />
                <h3 className="text-xl font-medium tracking-tight text-fg mb-2">No Round Account Found</h3>
                <p className="text-fg-muted mb-6">
                  It looks like you don&apos;t have a Round account set up yet, or there was an issue loading your account data.
                </p>
                <div className="flex items-center justify-center gap-4">
                  <ActionButton
                    label="Contact Support"
                    onClick={() => navigate('/help')}
                    size="md"
                    variant="secondary"
                    animated={false}
                  />
                  <ActionButton
                    label="Refresh Page"
                    onClick={() => window.location.reload()}
                    size="md"
                    variant="primary"
                    animated={false}
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  )
}

