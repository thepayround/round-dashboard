import React from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/shared/components'
import { CreditCard, Calendar, DollarSign, FileText, TrendingUp } from 'lucide-react'

export const BillingSection: React.FC = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-lg font-medium text-white mb-4">
          Billing{' '}
          <span className="bg-gradient-to-r from-[#D417C8] via-[#7767DA] to-[#14BDEA] bg-clip-text text-transparent">
            & Subscription
          </span>
        </h1>
        <p className="text-sm text-gray-400 mb-3">
          Manage your subscription, billing information, and usage
        </p>
      </div>

      {/* Current Plan */}
      <Card animate={false} padding="lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-[#D417C8]/20 to-[#14BDEA]/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-[#D417C8]" />
            </div>
            <div>
              <h3 className="text-sm font-normal tracking-tight text-white">Current Plan</h3>
              <p className="text-xs text-gray-400">Your active subscription</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-[#D417C8] hover:bg-[#BD2CD0] text-white text-xs font-normal tracking-tight rounded-lg transition-colors duration-200">
            Upgrade Plan
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card variant="nested" padding="lg">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-green-400" />
              <span className="text-xs font-normal tracking-tight text-gray-300">Monthly Cost</span>
            </div>
            <p className="text-lg font-medium text-white">$49.99</p>
            <p className="text-xs text-gray-400">Professional Plan</p>
          </Card>

          <Card variant="nested" padding="lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-normal tracking-tight text-gray-300">Next Billing</span>
            </div>
            <p className="text-lg font-medium text-white">Dec 15, 2024</p>
            <p className="text-xs text-gray-400">Auto-renewal enabled</p>
          </Card>

          <Card variant="nested" padding="lg">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-normal tracking-tight text-gray-300">Usage</span>
            </div>
            <p className="text-lg font-medium text-white">2,847</p>
            <p className="text-xs text-gray-400">API calls this month</p>
          </Card>
        </div>
      </Card>

      {/* Billing History */}
      <Card animate={false} padding="lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-[#32A1E4]/20 to-[#14BDEA]/20 rounded-lg">
            <FileText className="w-5 h-5 text-[#32A1E4]" />
          </div>
          <div>
            <h3 className="text-sm font-normal tracking-tight text-white">Billing History</h3>
            <p className="text-xs text-gray-400">Recent invoices and payments</p>
          </div>
        </div>

        <div className="text-center py-12">
          <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Billing Management</h3>
          <p className="text-gray-400 mb-4">View and manage your subscription, billing details, and usage.</p>
          <p className="text-sm text-gray-500">This section is coming soon...</p>
        </div>
      </Card>
    </motion.div>
  )