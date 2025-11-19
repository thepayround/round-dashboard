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
import { LoadingSpinner, UiDropdown } from '@/shared/ui'
import { ActionButton } from '@/shared/ui/ActionButton'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'

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
            <div className="flex items-center justify-center space-x-3">
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
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-normal tracking-tight text-white mb-1">
              Welcome back, {welcomeName}!
            </h1>
            <p className="text-gray-500 dark:text-polar-500 leading-snug">Here&apos;s an overview of your Round account</p>
          </div>
          {roundAccount && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full border ${
                roundAccount.status.toLowerCase() === 'active'
                  ? 'bg-primary/20 border-primary/30'
                  : 'bg-gray-500/20 border-gray-500/30'
              }`}
            >
              <CheckCircle className={`w-5 h-5 ${
                roundAccount.status.toLowerCase() === 'active' ? 'text-[#42E695]' : 'text-gray-400'
              }`} />
              <span className={`font-normal tracking-tight text-sm ${
                roundAccount.status.toLowerCase() === 'active' ? 'text-[#42E695]' : 'text-gray-400'
              }`}>
                {roundAccount.status}
              </span>
            </motion.div>
          )}
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-white">Performance snapshot</p>
              <p className="text-xs text-white/60">
                {filterSummary.segmentLabel} • {filterSummary.dateRangeLabel}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
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
                size="sm"
                onClick={refreshMetrics}
                loading={isRefreshing}
              >
                Refresh
              </Button>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-white/60">
            {isMetricsLoading && (
              <LoadingSpinner size="xs" label="Refreshing metrics…" className="text-white/60" />
            )}
            {lastUpdated && (
              <span>Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            )}
          </div>
        </div>
        {metricsError && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {metricsError}
          </div>
        )}

        {kpis.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
          >
            {kpis.map(kpi => (
              <Card key={kpi.id} padding="lg">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/60">{kpi.label}</p>
                    <p className="mt-2 text-2xl font-normal tracking-tight text-white">{kpi.formattedValue}</p>
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      kpi.trend === 'up'
                        ? 'text-[#42E695]'
                        : kpi.trend === 'down'
                          ? 'text-[#FF6B6B]'
                          : 'text-white/50'
                    }`}
                  >
                    {kpi.delta > 0 ? `+${kpi.delta}` : kpi.delta}
                    <span className="ml-1 text-white/50">%</span>
                  </span>
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
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-medium text-white">Revenue trend</h3>
                  <p className="text-sm text-white/60">{filterSummary.dateRangeLabel}</p>
                </div>
                <div className="text-xs text-white/60">
                  Goal vs. actual ({segmentOptions.find(option => option.id === filters.segmentId)?.label ?? 'All'})
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {chartData.map(point => {
                  const primaryWidth = Math.max(6, (point.primaryValue / maxChartValue) * 100)
                  const goalWidth = Math.max(6, (point.goalValue / maxChartValue) * 100)

                  return (
                    <div key={point.label}>
                      <div className="flex items-center justify-between text-xs text-white/60">
                        <span>{point.label}</span>
                        <span>{formatCurrency(point.primaryValue, metricsCurrency)}</span>
                      </div>
                      <div className="relative mt-2 h-3 rounded-full bg-white/5">
                        <div
                          className="absolute inset-y-0 left-0 rounded-full bg-white/15"
                          style={{ width: `${goalWidth}%` }}
                        />
                        <div
                          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#D417C8] to-[#7767DA]"
                          style={{ width: `${primaryWidth}%` }}
                        />
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[11px] text-white/50">
                        <span>Goal: {formatCurrency(point.goalValue, metricsCurrency)}</span>
                        <span>Δ {(point.primaryValue - point.goalValue).toFixed(0)}</span>
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {/* Account Type */}
            <Card padding="lg">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-white/60 text-xs font-normal tracking-tight mb-1">Account type</div>
                  <div className="text-white text-sm font-normal tracking-tight">{roundAccount.accountType}</div>
                </div>
                <div className="p-3 bg-primary/20 rounded-lg border border-[#D417C8]/30">
                  <Building className="w-4 h-4 text-[#D417C8]" />
                </div>
              </div>
            </Card>

            {/* Account Status */}
            <Card padding="lg">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-white/60 text-xs font-normal tracking-tight mb-1">Account status</div>
                  <div className="text-white text-sm font-normal tracking-tight">{roundAccount.status}</div>
                </div>
                <div className="p-3 bg-primary/20 rounded-lg border border-[#42E695]/30">
                  <CheckCircle className="w-4 h-4 text-[#42E695]" />
                </div>
              </div>
            </Card>

            {/* Created Date */}
            <Card padding="lg">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-white/60 text-xs font-normal tracking-tight mb-1">Created date</div>
                  <div className="text-white text-sm font-normal tracking-tight">
                    {new Date(roundAccount.createdDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="p-3 bg-primary/20 rounded-lg border border-[#14BDEA]/30">
                  <Clock className="w-4 h-4 text-[#14BDEA]" />
                </div>
              </div>
            </Card>

            {/* Currency */}
            {roundAccount.organization?.currency && (
              <Card padding="lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-white/60 text-xs font-normal tracking-tight mb-1">Currency</div>
                    <div className="text-white text-sm font-normal tracking-tight">{roundAccount.organization.currency}</div>
                  </div>
                  <div className="p-3 bg-primary/20 rounded-lg border border-[#7767DA]/30">
                    <DollarSign className="w-4 h-4 text-[#7767DA]" />
                  </div>
                </div>
              </Card>
            )}
          </motion.div>
        )}

        {/* Main Content Grid */}
        {roundAccount && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Account Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card padding="lg">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-primary/20 rounded-xl border border-[#32A1E4]/30">
                    <Building className="w-5 h-5 text-[#32A1E4]" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-normal tracking-tight text-white mb-2">Account details</h2>
                    <p className="text-gray-500 dark:text-polar-500 leading-snug">Core account information and settings</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Card variant="nested" padding="md">
                    <div className="flex items-center gap-3">
                      <Building2 className="w-4 h-4 text-[#14BDEA]" />
                      <div>
                        <div className="text-sm font-normal tracking-tight text-white">{roundAccount.accountName}</div>
                        <div className="text-xs text-white/60">Account name</div>
                      </div>
                    </div>
                  </Card>

                  <Card variant="nested" padding="md">
                    <div className="flex items-center gap-3">
                      <Building className="w-4 h-4 text-[#D417C8]" />
                      <div>
                        <div className="text-sm font-normal tracking-tight text-white font-mono">{roundAccount.roundAccountId}</div>
                        <div className="text-xs text-white/60">Account ID</div>
                      </div>
                    </div>
                  </Card>

                  <Card variant="nested" padding="md">
                    <div className="flex items-center gap-3">
                      <Building className="w-4 h-4 text-[#14BDEA]" />
                      <div>
                        <div className="text-sm font-normal tracking-tight text-white">{roundAccount.accountType}</div>
                        <div className="text-xs text-white/60">Account type</div>
                      </div>
                    </div>
                  </Card>

                  <Card variant="nested" padding="md">
                    <div className="flex items-center gap-3">
                      <CheckCircle className={`w-4 h-4 ${
                        roundAccount.status.toLowerCase() === 'active' ? 'text-[#42E695]' : 'text-gray-400'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs rounded-lg font-normal tracking-tight border ${
                            roundAccount.status.toLowerCase() === 'active' 
                              ? 'bg-[#42E695]/20 text-[#42E695] border-[#42E695]/30'
                              : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                          }`}>
                            {roundAccount.status}
                          </span>
                        </div>
                        <div className="text-xs text-white/60 mt-1">Status</div>
                      </div>
                    </div>
                  </Card>

                  <Card variant="nested" padding="md">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-[#7767DA]" />
                      <div>
                        <div className="text-sm font-normal tracking-tight text-white">
                          {new Date(roundAccount.createdDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="text-xs text-white/60">Created date</div>
                      </div>
                    </div>
                  </Card>

                  <Card variant="nested" padding="md">
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-[#32A1E4]" />
                      <div>
                        <div className="text-sm font-normal tracking-tight text-white">
                          {new Date(roundAccount.modifiedDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="text-xs text-white/60">Last modified</div>
                      </div>
                    </div>
                  </Card>
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
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-primary/20 rounded-xl border border-[#7767DA]/30">
                      <Building className="w-5 h-5 text-[#7767DA]" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-normal tracking-tight text-white mb-2">Organization details</h2>
                      <p className="text-gray-500 dark:text-polar-500 leading-snug">Company information and settings</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Card variant="nested" padding="md">
                      <div className="flex items-center gap-3">
                        <Building2 className="w-4 h-4 text-[#D417C8]" />
                        <div>
                          <div className="text-sm font-normal tracking-tight text-white">{roundAccount.organization.name}</div>
                          <div className="text-xs text-white/60">Organization name</div>
                        </div>
                      </div>
                    </Card>

                    <Card variant="nested" padding="md">
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-4 h-4 text-[#42E695]" />
                        <div>
                          <div className="text-sm font-normal tracking-tight text-white font-mono">{roundAccount.organization.organizationId}</div>
                          <div className="text-xs text-white/60">Organization ID</div>
                        </div>
                      </div>
                    </Card>

                    <Card variant="nested" padding="md">
                      <div className="flex items-center gap-3">
                        <Building className="w-4 h-4 text-[#14BDEA]" />
                        <div>
                          <div className="text-sm font-normal tracking-tight text-white">{roundAccount.organization.type}</div>
                          <div className="text-xs text-white/60">Organization type</div>
                        </div>
                      </div>
                    </Card>

                    <Card variant="nested" padding="md">
                      <div className="flex items-center gap-3">
                        <Building2 className="w-4 h-4 text-[#7767DA]" />
                        <div>
                          <div className="text-sm font-normal tracking-tight text-white">{roundAccount.organization.category}</div>
                          <div className="text-xs text-white/60">Industry category</div>
                        </div>
                      </div>
                    </Card>

                    {roundAccount.organization.industry && (
                      <Card variant="nested" padding="md">
                        <div className="flex items-center gap-3">
                          <Building2 className="w-4 h-4 text-[#32A1E4]" />
                          <div>
                            <div className="text-sm font-normal tracking-tight text-white">{roundAccount.organization.industry}</div>
                            <div className="text-xs text-white/60">Industry</div>
                          </div>
                        </div>
                      </Card>
                    )}

                    <Card variant="nested" padding="md">
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-4 h-4 text-[#42E695]" />
                        <div>
                          <div className="text-sm font-normal tracking-tight text-white">{roundAccount.organization.currency}</div>
                          <div className="text-xs text-white/60">Currency</div>
                        </div>
                      </div>
                    </Card>

                    <Card variant="nested" padding="md">
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-[#7767DA]" />
                        <div>
                          <div className="text-sm font-normal tracking-tight text-white">{roundAccount.organization.timeZone}</div>
                          <div className="text-xs text-white/60">Timezone</div>
                        </div>
                      </div>
                    </Card>

                    <Card variant="nested" padding="md">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-[#32A1E4]" />
                        <div>
                          <div className="text-sm font-normal tracking-tight text-white">{roundAccount.organization.country}</div>
                          <div className="text-xs text-white/60">Country</div>
                        </div>
                      </div>
                    </Card>

                    {roundAccount.organization.size && (
                      <Card variant="nested" padding="md">
                        <div className="flex items-center gap-3">
                          <Users className="w-4 h-4 text-[#14BDEA]" />
                          <div>
                            <div className="text-sm font-normal tracking-tight text-white">{roundAccount.organization.size}</div>
                            <div className="text-xs text-white/60">Organization size</div>
                          </div>
                        </div>
                      </Card>
                    )}

                    {roundAccount.organization.website && (
                      <Card variant="nested" padding="md">
                        <div className="flex items-center gap-3">
                          <ArrowUpRight className="w-4 h-4 text-[#32A1E4]" />
                          <div>
                            <a
                              href={roundAccount.organization.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-normal tracking-tight text-[#14BDEA] hover:text-[#32A1E4] transition-colors"
                            >
                              {roundAccount.organization.website}
                            </a>
                            <div className="text-xs text-white/60">Website</div>
                          </div>
                        </div>
                      </Card>
                    )}

                    {roundAccount.organization.registrationNumber && (
                      <Card variant="nested" padding="md">
                        <div className="flex items-center gap-3">
                          <Building2 className="w-4 h-4 text-amber-400" />
                          <div>
                            <div className="text-sm font-normal tracking-tight text-white">{roundAccount.organization.registrationNumber}</div>
                            <div className="text-xs text-white/60">Registration number</div>
                          </div>
                        </div>
                      </Card>
                    )}

                    {(roundAccount.organization.taxId && roundAccount.organization.taxId.trim() !== '') && (
                      <Card variant="nested" padding="md">
                        <div className="flex items-center gap-3">
                          <DollarSign className="w-4 h-4 text-amber-500" />
                          <div>
                            <div className="text-sm font-normal tracking-tight text-white">{roundAccount.organization.taxId}</div>
                            <div className="text-xs text-white/60">Tax ID</div>
                          </div>
                        </div>
                      </Card>
                    )}

                    {(typeof roundAccount.organization.revenue === 'number' && roundAccount.organization.revenue > 0) && (
                      <Card variant="nested" padding="md">
                        <div className="flex items-center gap-3">
                          <DollarSign className="w-4 h-4 text-[#42E695]" />
                          <div>
                            <div className="text-sm font-normal tracking-tight text-white">
                              {formatCurrency(roundAccount.organization.revenue, roundAccount.organization.currency)}
                            </div>
                            <div className="text-xs text-white/60">Annual revenue</div>
                          </div>
                        </div>
                      </Card>
                    )}

                    {roundAccount.organization.description && (
                      <Card variant="nested" padding="md">
                        <div className="flex items-start gap-3">
                          <Building className="w-4 h-4 text-[#7767DA] mt-0.5" />
                          <div>
                            <div className="text-sm font-normal tracking-tight text-white">{roundAccount.organization.description}</div>
                            <div className="text-xs text-white/60">Description</div>
                          </div>
                        </div>
                      </Card>
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
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-primary/20 rounded-xl border border-[#7767DA]/30">
                  <MapPin className="w-5 h-5 text-[#7767DA]" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-medium text-white mb-2">Account Addresses</h2>
                  <p className="text-gray-500 dark:text-polar-500 leading-snug">Billing and shipping addresses</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roundAccount.roundAccountAddresses.map((address) => (
                  <Card
                    key={address.addressId}
                    variant="nested"
                    padding="lg"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-white text-sm mb-2">{address.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-1 rounded-lg bg-[#7767DA]/20 text-[#7767DA] border border-[#7767DA]/30 font-medium">
                            {address.addressType}
                          </span>
                          {address.isPrimary && (
                            <span className="text-xs px-2 py-1 rounded-lg bg-[#42E695]/20 text-[#42E695] border border-[#42E695]/30 font-medium">
                              Primary
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-gray-500 dark:text-polar-500 leading-snug space-y-1">
                      <p>{address.number} {address.addressLine1}</p>
                      {address.addressLine2 && <p>{address.addressLine2}</p>}
                      <p>{address.city}, {address.state} {address.zipCode}</p>
                      <p>{address.country}</p>
                    </div>
                  </Card>
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
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-primary/20 rounded-xl border border-[#32A1E4]/30">
                  <Users className="w-5 h-5 text-[#32A1E4]" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-medium text-white mb-2">Account Users</h2>
                  <p className="text-gray-500 dark:text-polar-500 leading-snug">Team members with access to this account</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roundAccount.roundAccountUsers.map((accountUser) => (
                  <Card
                    key={`${accountUser.roundAccountId}-${accountUser.userId}`}
                    variant="nested"
                    padding="lg"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white text-sm mb-1">User ID</p>
                        <p className="text-xs text-gray-400 font-mono break-all">{accountUser.userId}</p>
                        {accountUser.role && (
                          <span className="inline-block mt-2 text-xs px-2 py-1 rounded-lg bg-[#32A1E4]/20 text-[#32A1E4] border border-[#32A1E4]/30 font-medium">
                            {accountUser.role}
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
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
                <Building className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-medium tracking-tight text-white mb-2">No Round Account Found</h3>
                <p className="text-gray-400 mb-6">
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

