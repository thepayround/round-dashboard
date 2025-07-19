import { motion } from 'framer-motion'
import { CreditCard, TrendingUp, DollarSign, Users, Clock, CheckCircle } from 'lucide-react'
import { DashboardLayout } from '@/shared/components/DashboardLayout'

export const BillingPage = () => (
  <DashboardLayout>
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="gradient-header" />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold auth-text mb-2">Billing Management</h1>
            <p className="auth-text-muted text-lg">
              Manage your billing, subscriptions, and revenue tracking
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary px-6 py-3"
          >
            Create Invoice
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <div className="auth-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="auth-text-muted text-sm font-medium">Monthly Revenue</p>
              <p className="auth-text text-2xl font-bold">$24,500</p>
              <p className="text-[#42E695] text-sm font-medium">+12.5% from last month</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#42E695]/20 to-[#3BB2B8]/20 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-[#42E695]" />
            </div>
          </div>
        </div>

        <div className="auth-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="auth-text-muted text-sm font-medium">Active Subscriptions</p>
              <p className="auth-text text-2xl font-bold">1,247</p>
              <p className="text-[#32A1E4] text-sm font-medium">+8.2% from last month</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#32A1E4]/20 to-[#7767DA]/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-[#32A1E4]" />
            </div>
          </div>
        </div>

        <div className="auth-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="auth-text-muted text-sm font-medium">Payment Success Rate</p>
              <p className="auth-text text-2xl font-bold">96.8%</p>
              <p className="text-[#42E695] text-sm font-medium">+2.1% from last month</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7767DA]/20 to-[#BD2CD0]/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-[#7767DA]" />
            </div>
          </div>
        </div>

        <div className="auth-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="auth-text-muted text-sm font-medium">Avg. Collection Time</p>
              <p className="auth-text text-2xl font-bold">3.2 days</p>
              <p className="text-[#FFC107] text-sm font-medium">-0.5 days from last month</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#BD2CD0]/20 to-[#D417C8]/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-[#BD2CD0]" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Invoices */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="auth-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold auth-text">Recent Invoices</h2>
              <button className="text-[#D417C8] hover:text-[#BD2CD0] font-medium">View All</button>
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(invoice => (
                <div
                  key={invoice}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D417C8]/20 to-[#14BDEA]/20 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-[#D417C8]" />
                    </div>
                    <div>
                      <p className="auth-text font-medium">Invoice #{invoice}001</p>
                      <p className="auth-text-muted text-sm">Customer Name {invoice}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="auth-text font-medium">${(invoice * 125).toFixed(2)}</p>
                    <p className="text-[#42E695] text-sm">Paid</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-1"
        >
          <div className="auth-card">
            <div className="flex items-center space-x-3 mb-6">
              <TrendingUp className="w-6 h-6 text-[#32A1E4]" />
              <h2 className="text-xl font-bold auth-text">Revenue Trend</h2>
            </div>
            <div className="space-y-4">
              <div className="text-center">
                <p className="auth-text text-3xl font-bold mb-2">$24,500</p>
                <p className="auth-text-muted text-sm">This Month</p>
              </div>
              <div className="h-32 bg-gradient-to-t from-[#D417C8]/20 to-[#14BDEA]/20 rounded-xl flex items-end justify-center">
                <p className="auth-text-muted text-sm mb-4">Revenue chart would go here</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </DashboardLayout>
)
