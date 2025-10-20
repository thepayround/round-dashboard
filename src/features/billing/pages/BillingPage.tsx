import { motion } from 'framer-motion'
import { CreditCard, TrendingUp, DollarSign, Users, Clock, CheckCircle } from 'lucide-react'
import { DashboardLayout } from '@/shared/components/DashboardLayout'
import { ActionButton, SectionHeader, Card } from '@/shared/components'

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
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
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
          color="accent"
          trend={{ value: "+8.2%", direction: "up", label: "from last month" }}
          animate={false}
        />
        
        <Card
          variant="stats"
          title="Payment Success Rate"
          value="96.8%"
          icon={CheckCircle}
          color="secondary"
          trend={{ value: "+2.1%", direction: "up", label: "from last month" }}
          animate={false}
        />
        
        <Card
          variant="stats"
          title="Avg. Collection Time"
          value="3.2 days"
          icon={Clock}
          color="primary"
          trend={{ value: "-0.5 days", direction: "up", label: "from last month" }}
          animate={false}
        />
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Invoices */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card padding="lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-white">Recent Invoices</h2>
              <button className="text-[#D417C8] hover:text-[#BD2CD0] font-medium text-sm transition-colors">View All</button>
            </div>
            <div className="grid gap-3">
              {[1, 2, 3, 4, 5].map(invoice => (
                <Card key={invoice} variant="nested" padding="md" clickable>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D417C8]/20 to-[#14BDEA]/20 flex items-center justify-center flex-shrink-0">
                        <CreditCard className="w-5 h-5 text-[#D417C8]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-medium text-sm truncate">Invoice #{invoice}001</p>
                        <p className="text-white/60 text-xs truncate">Customer Name {invoice}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="text-white font-medium text-sm">${(invoice * 125).toFixed(2)}</p>
                      <p className="text-[#42E695] text-xs">Paid</p>
                    </div>
                  </div>
                </Card>
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
          <Card padding="lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#32A1E4]/20 to-[#14BDEA]/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#32A1E4]" />
              </div>
              <h2 className="text-lg font-medium text-white">Revenue Trend</h2>
            </div>
            <div className="space-y-4">
              <Card variant="nested" padding="md">
                <div className="text-center">
                  <p className="text-white text-2xl sm:text-3xl font-medium mb-1 tracking-tight">$24,500</p>
                  <p className="text-white/60 text-sm">This Month</p>
                </div>
              </Card>
              <Card variant="nested" padding="lg">
                <div className="h-32 bg-gradient-to-t from-[#D417C8]/20 to-[#14BDEA]/20 rounded-lg flex items-end justify-center">
                  <p className="text-white/60 text-sm mb-2">Revenue chart would go here</p>
                </div>
              </Card>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  </DashboardLayout>
)
