import { motion } from 'framer-motion'
import { CreditCard, TrendingUp, DollarSign, Users, Clock, CheckCircle } from 'lucide-react'
import { DashboardLayout } from '@/shared/components/DashboardLayout'
import { ActionButton, Card, SectionHeader } from '@/shared/components'

export const BillingPage = () => (
  <DashboardLayout>
    <div className="space-y-8">
      {/* Header */}
      <SectionHeader
        title="Billing Management"
        subtitle="Manage your billing, subscriptions, and revenue tracking"
        size="main"
        actions={
          <ActionButton
            label="Create Invoice"
            onClick={() => { /* Create invoice clicked */ }}
            size="md"
            animated={false}
          />
        }
      />

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <Card
          variant="stats"
          title="Monthly Revenue"
          value="$24,500"
          icon={DollarSign}
          color="success"
          trend={{ value: "+12.5%", direction: "up", label: "from last month" }}
          animate={false}
        />

        <Card
          variant="stats"
          title="Active Subscriptions"
          value="1,247"
          icon={Users}
          color="secondary"
          trend={{ value: "+8.2%", direction: "up", label: "from last month" }}
          animate={false}
        />

        <Card
          variant="stats"
          title="Payment Success Rate"
          value="96.8%"
          icon={CheckCircle}
          color="accent"
          trend={{ value: "+2.1%", direction: "up", label: "from last month" }}
          animate={false}
        />

        <Card
          variant="stats"
          title="Avg. Collection Time"
          value="3.2 days"
          icon={Clock}
          color="primary"
          trend={{ value: "-0.5 days", direction: "down", label: "from last month" }}
          animate={false}
        />
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
          <Card animate={false}>
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
          </Card>
        </motion.div>

        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-1"
        >
          <Card animate={false}>
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
          </Card>
        </motion.div>
      </div>
    </div>
  </DashboardLayout>
)
