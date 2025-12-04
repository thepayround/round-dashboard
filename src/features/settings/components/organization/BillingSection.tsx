import { motion } from 'framer-motion'
import { CreditCard, Calendar, DollarSign, FileText, TrendingUp } from 'lucide-react'
import React from 'react'

import { DetailCard } from '@/shared/ui/DetailCard'
import { Button } from '@/shared/ui/shadcn/button'
import { Card } from '@/shared/ui/shadcn/card'


export const BillingSection: React.FC = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-lg font-medium text-foreground mb-2">
          Billing{' '}
          <span className="text-primary">
            & Subscription
          </span>
        </h1>
        <p className="text-muted-foreground text-sm leading-snug">
          Manage your subscription, billing information, and usage
        </p>
      </div>

      {/* Current Plan */}
      <DetailCard
        title="Current Plan"
        icon={<TrendingUp className="h-4 w-4" />}
        actions={
          <Button variant="default">
            Upgrade Plan
          </Button>
        }
      >
        <p className="text-sm text-muted-foreground mb-6">Your active subscription</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="p-4 bg-muted/50 border-border">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-success" />
              <span className="text-xs font-medium text-muted-foreground">Monthly Cost</span>
            </div>
            <p className="text-lg font-medium text-foreground">$49.99</p>
            <p className="text-xs text-muted-foreground">Professional Plan</p>
          </Card>

          <Card className="p-4 bg-muted/50 border-border">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-muted-foreground">Next Billing</span>
            </div>
            <p className="text-lg font-medium text-foreground">Dec 15, 2024</p>
            <p className="text-xs text-muted-foreground">Auto-renewal enabled</p>
          </Card>

          <Card className="p-4 bg-muted/50 border-border">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-secondary" />
              <span className="text-xs font-medium text-muted-foreground">Usage</span>
            </div>
            <p className="text-lg font-medium text-foreground">2,847</p>
            <p className="text-xs text-muted-foreground">API calls this month</p>
          </Card>
        </div>
      </DetailCard>

      {/* Billing History */}
      <DetailCard
        title="Billing History"
        icon={<FileText className="h-4 w-4" />}
      >
        <div className="text-center py-12">
          <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-base font-medium text-foreground mb-2">Billing Management</h3>
          <p className="text-sm text-muted-foreground mb-4">View and manage your subscription, billing details, and usage.</p>
          <p className="text-sm text-muted-foreground">This section is coming soon...</p>
        </div>
      </DetailCard>
    </motion.div>
  )
