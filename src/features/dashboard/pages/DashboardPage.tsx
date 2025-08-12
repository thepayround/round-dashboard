import { motion } from 'framer-motion'
import {
  User,
  Building,
  Package,
  Users,
  Settings,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react'

import { DashboardLayout } from '@/shared/components/DashboardLayout'
import { useCurrency } from '@/shared/hooks/useCurrency'
import { Card, SectionHeader, ActionButton } from '@/shared/components'
import { useAuth } from '@/shared/hooks/useAuth'
import type { ProductInfo, TeamSettings } from '@/features/onboarding/types/onboarding'

export const DashboardPage = () => {
  const { state } = useAuth()
  const { user, isLoading } = state
  const { formatCurrency } = useCurrency()

  if (isLoading) {
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

  const { onboardingData } = user

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
            user.onboardingCompleted && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#42E695]/20 to-[#3BB2B8]/20 border border-[#42E695]/30"
              >
                <CheckCircle className="w-5 h-5 text-[#42E695]" />
                <span className="text-[#42E695] font-medium">Setup Complete</span>
              </motion.div>
            )
          }
        />

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card
            variant="compact"
            title="Account Type"
            value={user.accountType}
            icon={User}
            color="primary"
            animate={false}
          />

          <Card
            variant="compact"
            title="Member Since"
            value={new Date(user.createdAt).toLocaleDateString()}
            icon={Clock}
            color="secondary"
            animate={false}
          />

          {onboardingData?.businessSettings && (
            <Card
              variant="compact"
              title="Currency"
              value={onboardingData.businessSettings?.currency}
              icon={DollarSign}
              color="accent"
              animate={false}
            />
          )}

          <Card
            variant="compact"
            title="Setup Status"
            value={user.onboardingCompleted ? '100%' : '0%'}
            icon={TrendingUp}
            color="success"
            animate={false}
          />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card animate={false}>
              <div className="flex items-center space-x-3 mb-6">
                <User className="w-6 h-6 text-[#D417C8]" />
                <h2 className="text-xl font-bold auth-text">Profile Information</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium auth-text-muted">Full Name</span>
                  <p className="auth-text font-medium">
                    {user.firstName} {user.lastName}
                  </p>
                </div>

                <div>
                  <span className="text-sm font-medium auth-text-muted">Email</span>
                  <p className="auth-text font-medium">{user.email}</p>
                </div>

                <div>
                  <span className="text-sm font-medium auth-text-muted">Phone</span>
                  <p className="auth-text font-medium">{user.phone}</p>
                </div>

                {onboardingData?.userInfo && (
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-sm auth-text-muted mb-2">Onboarding Information:</p>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-[#42E695]" />
                        <span className="text-sm auth-text-muted">Personal details completed</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Organization Info */}
          {user.accountType === 'business' && onboardingData?.organization && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2"
            >
              <Card animate={false}>
                <div className="flex items-center space-x-3 mb-6">
                  <Building className="w-6 h-6 text-[#32A1E4]" />
                  <h2 className="text-xl font-bold auth-text">Organization Details</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <span className="text-sm font-medium auth-text-muted">Company Name</span>
                    <p className="auth-text font-medium">
                      {onboardingData.organization?.companyName}
                    </p>
                  </div>

                  <div>
                    <span className="text-sm font-medium auth-text-muted">Industry</span>
                    <p className="auth-text font-medium capitalize">
                      {onboardingData.organization?.industry}
                    </p>
                  </div>

                  <div>
                    <span className="text-sm font-medium auth-text-muted">Company Size</span>
                    <p className="auth-text font-medium">
                      {onboardingData.organization?.companySize}
                    </p>
                  </div>

                  {onboardingData.organization?.website && (
                    <div>
                      <span className="text-sm font-medium auth-text-muted">Website</span>
                      <a
                        href={onboardingData.organization?.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="auth-link brand-primary flex items-center space-x-1"
                      >
                        <span>{onboardingData.organization?.website}</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Additional Sections */}
        {onboardingData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {/* Business Settings */}
            {onboardingData.businessSettings && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card animate={false}>
                  <div className="flex items-center space-x-3 mb-6">
                    <Settings className="w-6 h-6 text-[#7767DA]" />
                    <h2 className="text-xl font-bold auth-text">Business Settings</h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="text-sm font-medium auth-text-muted">Currency</span>
                      <p className="auth-text font-medium">
                        {onboardingData.businessSettings?.currency}
                      </p>
                    </div>

                    <div>
                      <span className="text-sm font-medium auth-text-muted">Timezone</span>
                      <p className="auth-text font-medium">
                        {onboardingData.businessSettings?.timezone}
                      </p>
                    </div>

                    <div>
                      <span className="text-sm font-medium auth-text-muted">Fiscal Year Start</span>
                      <p className="auth-text font-medium">
                        {onboardingData.businessSettings?.fiscalYearStart}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Products & Services */}
            {onboardingData.products && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card animate={false}>
                  <div className="flex items-center space-x-3 mb-6">
                    <Package className="w-6 h-6 text-[#14BDEA]" />
                    <h2 className="text-xl font-bold auth-text">Products & Services</h2>
                  </div>

                  {onboardingData.products?.hasProducts &&
                  onboardingData.products?.products &&
                  onboardingData.products.products.length > 0 ? (
                    <div className="space-y-3">
                      {onboardingData.products?.products?.map(
                        (product: ProductInfo['products'][0]) => (
                          <div
                            key={product.id}
                            className="p-4 rounded-xl bg-white/5 border border-white/10"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-medium auth-text">{product.name}</h3>
                                <p className="text-sm auth-text-muted">{product.description}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium auth-text">
                                  {formatCurrency(product.price, onboardingData?.businessSettings?.currency ?? 'USD')}
                                </p>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 auth-text-muted mx-auto mb-4" />
                      <p className="auth-text-muted">No products added yet</p>
                      <div className="mt-4">
                        <ActionButton
                          label="Add Your First Product"
                          onClick={() => {/* Navigate to products page */}}
                          size="md"
                          variant="primary"
                          animated={false}
                        />
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>
            )}
          </div>
        )}

        {/* Team Section */}
        {onboardingData?.team?.invitations && onboardingData.team.invitations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8"
          >
            <Card animate={false}>
              <div className="flex items-center space-x-3 mb-6">
                <Users className="w-6 h-6 text-[#32A1E4]" />
                <h2 className="text-xl font-bold auth-text">Team Invitations</h2>
              </div>

              <div className="space-y-3">
                {onboardingData.team?.invitations?.map(
                  (invitation: TeamSettings['invitations'][0]) => (
                    <div
                      key={invitation.id}
                      className="p-4 rounded-xl bg-white/5 border border-white/10"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium auth-text">{invitation.email}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs px-2 py-1 rounded-full bg-[#32A1E4]/20 text-[#32A1E4] border border-[#32A1E4]/30">
                              {invitation.role}
                            </span>
                            <span className="text-xs auth-text-muted">
                              Status: {invitation.status}
                            </span>
                          </div>
                        </div>
                        <Clock className="w-5 h-5 auth-text-muted" />
                      </div>
                    </div>
                  )
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  )
}
