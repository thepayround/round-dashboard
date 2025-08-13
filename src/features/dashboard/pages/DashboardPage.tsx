import { motion } from 'framer-motion'
import {
  User,
  Building,
  Users,
  CheckCircle,
  Clock,
  DollarSign,
  ArrowUpRight,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { DashboardLayout } from '@/shared/components/DashboardLayout'
import { useCurrency } from '@/shared/hooks/useCurrency'
import { useRoundAccount } from '@/shared/hooks/useRoundAccount'
import { Card, SectionHeader, ActionButton } from '@/shared/components'
import { useAuth } from '@/shared/hooks/useAuth'

export const DashboardPage = () => {
  const navigate = useNavigate()
  const { state } = useAuth()
  const { user, isLoading } = state
  const { roundAccount, isLoading: isRoundAccountLoading } = useRoundAccount()
  const { formatCurrency } = useCurrency()

  if (isLoading || isRoundAccountLoading) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-6 h-6 border-2 border-[#D417C8] border-t-transparent rounded-full animate-spin" />
              <p className="auth-text-muted">Loading your account...</p>
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
        {/* Header */}
        <SectionHeader
          title={`Welcome back, ${
            user.firstName && user.lastName
              ? `${user.firstName} ${user.lastName}`
              : user.firstName || user.email || 'User'
          }!`}
          subtitle="Here's an overview of your Round account"
          size="main"
          actions={
            roundAccount && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full border ${
                  roundAccount.status.toLowerCase() === 'active'
                    ? 'bg-gradient-to-r from-[#42E695]/20 to-[#3BB2B8]/20 border-[#42E695]/30'
                    : 'bg-gradient-to-r from-gray-500/20 to-gray-400/20 border-gray-500/30'
                }`}
              >
                <CheckCircle className={`w-5 h-5 ${
                  roundAccount.status.toLowerCase() === 'active' ? 'text-[#42E695]' : 'text-gray-400'
                }`} />
                <span className={`font-medium ${
                  roundAccount.status.toLowerCase() === 'active' ? 'text-[#42E695]' : 'text-gray-400'
                }`}>
                  {roundAccount.status}
                </span>
              </motion.div>
            )
          }
        />

        {/* Round Account Quick Stats */}
        {roundAccount && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <Card
              variant="compact"
              title="Account Type"
              value={roundAccount.accountType}
              icon={Building}
              color="primary"
              animate={false}
            />

            <Card
              variant="compact"
              title="Account Status"
              value={roundAccount.status}
              icon={CheckCircle}
              color="success"
              animate={false}
            />

            <Card
              variant="compact"
              title="Created Date"
              value={new Date(roundAccount.createdDate).toLocaleDateString()}
              icon={Clock}
              color="secondary"
              animate={false}
            />

            {roundAccount.organization?.currency && (
              <Card
                variant="compact"
                title="Currency"
                value={roundAccount.organization.currency}
                icon={DollarSign}
                color="accent"
                animate={false}
              />
            )}
          </motion.div>
        )}

        {/* Round Account Main Content Grid */}
        {roundAccount && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Round Account Details Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card animate={false}>
                <div className="flex items-center space-x-3 mb-6">
                  <Building className="w-6 h-6 text-[#32A1E4]" />
                  <h2 className="text-xl font-bold auth-text">Account Details</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium auth-text-muted">Account Name</span>
                    <p className="auth-text font-medium">{roundAccount.accountName}</p>
                  </div>

                  <div>
                    <span className="text-sm font-medium auth-text-muted">Account ID</span>
                    <p className="auth-text font-medium font-mono text-sm">{roundAccount.roundAccountId}</p>
                  </div>

                  <div>
                    <span className="text-sm font-medium auth-text-muted">Account Type</span>
                    <p className="auth-text font-medium capitalize">{roundAccount.accountType}</p>
                  </div>

                  <div>
                    <span className="text-sm font-medium auth-text-muted">Status</span>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        roundAccount.status.toLowerCase() === 'active' 
                          ? 'bg-[#42E695]/20 text-[#42E695] border border-[#42E695]/30'
                          : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      }`}>
                        {roundAccount.status}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-sm font-medium auth-text-muted">Created Date</span>
                    <p className="auth-text font-medium">
                      {new Date(roundAccount.createdDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>

                  <div>
                    <span className="text-sm font-medium auth-text-muted">Last Modified</span>
                    <p className="auth-text font-medium">
                      {new Date(roundAccount.modifiedDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Organization Details Card */}
            {roundAccount.organization && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card animate={false}>
                  <div className="flex items-center space-x-3 mb-6">
                    <Building className="w-6 h-6 text-[#7767DA]" />
                    <h2 className="text-xl font-bold auth-text">Organization Details</h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="text-sm font-medium auth-text-muted">Organization Name</span>
                      <p className="auth-text font-medium">{roundAccount.organization.name}</p>
                    </div>

                    <div>
                      <span className="text-sm font-medium auth-text-muted">Organization ID</span>
                      <p className="auth-text font-medium font-mono text-sm">{roundAccount.organization.organizationId}</p>
                    </div>

                    <div>
                      <span className="text-sm font-medium auth-text-muted">Organization Type</span>
                      <p className="auth-text font-medium capitalize">{roundAccount.organization.type}</p>
                    </div>

                    <div>
                      <span className="text-sm font-medium auth-text-muted">Industry Category</span>
                      <p className="auth-text font-medium capitalize">{roundAccount.organization.category}</p>
                    </div>

                    <div>
                      <span className="text-sm font-medium auth-text-muted">Currency</span>
                      <p className="auth-text font-medium">{roundAccount.organization.currency}</p>
                    </div>

                    <div>
                      <span className="text-sm font-medium auth-text-muted">Timezone</span>
                      <p className="auth-text font-medium">{roundAccount.organization.timeZone}</p>
                    </div>

                    <div>
                      <span className="text-sm font-medium auth-text-muted">Country</span>
                      <p className="auth-text font-medium">{roundAccount.organization.country}</p>
                    </div>

                    {roundAccount.organization.size && (
                      <div>
                        <span className="text-sm font-medium auth-text-muted">Organization Size</span>
                        <p className="auth-text font-medium">{roundAccount.organization.size}</p>
                      </div>
                    )}

                    {roundAccount.organization.website && (
                      <div>
                        <span className="text-sm font-medium auth-text-muted">Website</span>
                        <a
                          href={roundAccount.organization.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="auth-link brand-primary flex items-center space-x-1"
                        >
                          <span>{roundAccount.organization.website}</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      </div>
                    )}

                    {roundAccount.organization.registrationNumber && (
                      <div>
                        <span className="text-sm font-medium auth-text-muted">Registration Number</span>
                        <p className="auth-text font-medium">{roundAccount.organization.registrationNumber}</p>
                      </div>
                    )}

                    {roundAccount.organization.revenue && (
                      <div>
                        <span className="text-sm font-medium auth-text-muted">Annual Revenue</span>
                        <p className="auth-text font-medium">
                          {formatCurrency(roundAccount.organization.revenue, roundAccount.organization.currency)}
                        </p>
                      </div>
                    )}

                    {roundAccount.organization.description && (
                      <div>
                        <span className="text-sm font-medium auth-text-muted">Description</span>
                        <p className="auth-text font-medium">{roundAccount.organization.description}</p>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}
          </div>
        )}

        {/* Round Account Addresses */}
        {roundAccount?.roundAccountAddresses && roundAccount.roundAccountAddresses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <Card animate={false}>
              <div className="flex items-center space-x-3 mb-6">
                <Building className="w-6 h-6 text-[#7767DA]" />
                <h2 className="text-xl font-bold auth-text">Account Addresses</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roundAccount.roundAccountAddresses.map((address) => (
                  <div
                    key={address.addressId}
                    className="p-4 rounded-xl bg-white/5 border border-white/10"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium auth-text">{address.name}</h3>
                        <span className="text-xs px-2 py-1 rounded-full bg-[#7767DA]/20 text-[#7767DA] border border-[#7767DA]/30">
                          {address.addressType}
                        </span>
                        {address.isPrimary && (
                          <span className="ml-2 text-xs px-2 py-1 rounded-full bg-[#42E695]/20 text-[#42E695] border border-[#42E695]/30">
                            Primary
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-sm auth-text-muted space-y-1">
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

        {/* Round Account Users Section */}
        {roundAccount?.roundAccountUsers && roundAccount.roundAccountUsers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <Card animate={false}>
              <div className="flex items-center space-x-3 mb-6">
                <Users className="w-6 h-6 text-[#32A1E4]" />
                <h2 className="text-xl font-bold auth-text">Account Users</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roundAccount.roundAccountUsers.map((accountUser) => (
                  <div
                    key={`${accountUser.roundAccountId}-${accountUser.userId}`}
                    className="p-4 rounded-xl bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#D417C8] to-[#14BDEA] flex items-center justify-center text-white text-sm font-medium mb-2">
                          <User className="w-4 h-4" />
                        </div>
                        <p className="font-medium auth-text text-sm">User ID</p>
                        <p className="text-xs auth-text-muted font-mono break-all">{accountUser.userId}</p>
                        {accountUser.role && (
                          <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-[#32A1E4]/20 text-[#32A1E4] border border-[#32A1E4]/30">
                            {accountUser.role}
                          </span>
                        )}
                      </div>
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
            className="text-center py-12"
          >
            <Building className="w-16 h-16 auth-text-muted mx-auto mb-4" />
            <h3 className="text-xl font-semibold auth-text mb-2">No Round Account Found</h3>
            <p className="auth-text-muted mb-6">
              It looks like you don&apos;t have a Round account set up yet, or there was an issue loading your account data.
            </p>
            <div className="space-x-4">
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
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  )
}
