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
import { useAuthState } from '@/shared/hooks/useAuth'
import type { ProductInfo, TeamSettings } from '@/features/onboarding/types/onboarding'

export const DashboardPage = () => {
  const { user } = useAuthState()

  if (!user) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <div className="text-center">
            <p className="auth-text-muted">Loading user data...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const { onboardingData } = user

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="gradient-header" />
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold auth-text mb-2">Welcome back, {user.firstName}!</h1>
              <p className="auth-text-muted text-lg">
                Here&apos;s an overview of your Round account
              </p>
            </div>

            {user.onboardingCompleted && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#42E695]/20 to-[#3BB2B8]/20 border border-[#42E695]/30"
              >
                <CheckCircle className="w-5 h-5 text-[#42E695]" />
                <span className="text-[#42E695] font-medium">Setup Complete</span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="auth-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="auth-text-muted text-sm font-medium">Account Type</p>
                <p className="auth-text text-xl font-bold capitalize">{user.accountType}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D417C8]/20 to-[#14BDEA]/20 flex items-center justify-center">
                <User className="w-6 h-6 text-[#D417C8]" />
              </div>
            </div>
          </div>

          <div className="auth-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="auth-text-muted text-sm font-medium">Member Since</p>
                <p className="auth-text text-xl font-bold">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#32A1E4]/20 to-[#7767DA]/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-[#32A1E4]" />
              </div>
            </div>
          </div>

          {onboardingData?.businessSettings && (
            <div className="auth-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="auth-text-muted text-sm font-medium">Currency</p>
                  <p className="auth-text text-xl font-bold">
                    {onboardingData.businessSettings.currency}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7767DA]/20 to-[#BD2CD0]/20 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-[#7767DA]" />
                </div>
              </div>
            </div>
          )}

          <div className="auth-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="auth-text-muted text-sm font-medium">Setup Status</p>
                <p className="auth-text text-xl font-bold">
                  {user.onboardingCompleted ? '100%' : '0%'}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#BD2CD0]/20 to-[#D417C8]/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#BD2CD0]" />
              </div>
            </div>
          </div>
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
            <div className="auth-card">
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
            </div>
          </motion.div>

          {/* Organization Info */}
          {user.accountType === 'business' && onboardingData?.organization && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2"
            >
              <div className="auth-card">
                <div className="flex items-center space-x-3 mb-6">
                  <Building className="w-6 h-6 text-[#32A1E4]" />
                  <h2 className="text-xl font-bold auth-text">Organization Details</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <span className="text-sm font-medium auth-text-muted">Company Name</span>
                    <p className="auth-text font-medium">
                      {onboardingData.organization.companyName}
                    </p>
                  </div>

                  <div>
                    <span className="text-sm font-medium auth-text-muted">Industry</span>
                    <p className="auth-text font-medium capitalize">
                      {onboardingData.organization.industry}
                    </p>
                  </div>

                  <div>
                    <span className="text-sm font-medium auth-text-muted">Company Size</span>
                    <p className="auth-text font-medium">
                      {onboardingData.organization.companySize}
                    </p>
                  </div>

                  {onboardingData.organization.website && (
                    <div>
                      <span className="text-sm font-medium auth-text-muted">Website</span>
                      <a
                        href={onboardingData.organization.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="auth-link brand-primary flex items-center space-x-1"
                      >
                        <span>{onboardingData.organization.website}</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
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
                <div className="auth-card">
                  <div className="flex items-center space-x-3 mb-6">
                    <Settings className="w-6 h-6 text-[#7767DA]" />
                    <h2 className="text-xl font-bold auth-text">Business Settings</h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="text-sm font-medium auth-text-muted">Currency</span>
                      <p className="auth-text font-medium">
                        {onboardingData.businessSettings.currency}
                      </p>
                    </div>

                    <div>
                      <span className="text-sm font-medium auth-text-muted">Timezone</span>
                      <p className="auth-text font-medium">
                        {onboardingData.businessSettings.timezone}
                      </p>
                    </div>

                    <div>
                      <span className="text-sm font-medium auth-text-muted">Fiscal Year Start</span>
                      <p className="auth-text font-medium">
                        {onboardingData.businessSettings.fiscalYearStart}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Products & Services */}
            {onboardingData.products && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="auth-card">
                  <div className="flex items-center space-x-3 mb-6">
                    <Package className="w-6 h-6 text-[#14BDEA]" />
                    <h2 className="text-xl font-bold auth-text">Products & Services</h2>
                  </div>

                  {onboardingData.products.hasProducts &&
                  onboardingData.products.products.length > 0 ? (
                    <div className="space-y-3">
                      {onboardingData.products.products.map(
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
                                <p className="font-medium auth-text">${product.price}</p>
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
                      <button className="btn-primary mt-4 px-4 py-2">Add Your First Product</button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Team Section */}
        {onboardingData?.team && onboardingData.team.invitations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8"
          >
            <div className="auth-card">
              <div className="flex items-center space-x-3 mb-6">
                <Users className="w-6 h-6 text-[#32A1E4]" />
                <h2 className="text-xl font-bold auth-text">Team Invitations</h2>
              </div>

              <div className="space-y-3">
                {onboardingData.team.invitations.map(
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
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  )
}
