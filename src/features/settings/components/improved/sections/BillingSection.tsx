import { motion } from 'framer-motion'
import {
  CreditCard,
  Download,
  Plus,
  CheckCircle,
  Building,
  FileText,
} from 'lucide-react'
import React from 'react'

import {
  DetailCard,
  StatusBadge,
} from '@/shared/ui/DetailCard'
import { Button } from '@/shared/ui/shadcn/button'
import { Label } from '@/shared/ui/shadcn/label'
import { Switch } from '@/shared/ui/shadcn/switch'

export const BillingSection: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="space-y-6"
  >
    {/* Billing Overview */}
    <DetailCard
      title="Current Plan"
      icon={<CreditCard className="h-4 w-4" />}
    >
      <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-medium text-foreground">
              Professional Plan
            </h3>
            <p className="text-sm text-muted-foreground">
              Billed monthly &bull; Next billing: March 15, 2024
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-medium text-foreground">$49</div>
            <div className="text-xs text-muted-foreground">per month</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-success">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm font-medium">Active subscription</span>
        </div>
      </div>
    </DetailCard>

    {/* Payment Methods */}
    <DetailCard
      title="Payment Methods"
      icon={<CreditCard className="h-4 w-4" />}
      actions={
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Payment Method
        </Button>
      }
    >
      <div className="space-y-3">
        <div className="p-4 bg-muted/50 border border-border rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CreditCard className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-medium text-foreground font-mono">
                    &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 4242
                  </span>
                  <StatusBadge status="active" label="Primary" />
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>Expires 12/24</span>
                  <span>Visa</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-primary hover:text-primary/80"
              >
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DetailCard>

    {/* Billing Details Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Billing Address */}
      <DetailCard
        title="Billing Address"
        icon={<Building className="h-4 w-4" />}
        onEdit={() => {}}
      >
        <div className="p-4 bg-muted/50 border border-border rounded-lg">
          <div className="space-y-1 text-sm">
            <p className="font-medium text-foreground">Acme Corporation</p>
            <p className="text-muted-foreground">123 Business Street</p>
            <p className="text-muted-foreground">Suite 100</p>
            <p className="text-muted-foreground">San Francisco, CA 94105</p>
            <p className="text-muted-foreground">United States</p>
          </div>
        </div>
      </DetailCard>

      {/* Invoice Preferences */}
      <DetailCard
        title="Invoice Preferences"
        icon={<FileText className="h-4 w-4" />}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Download className="h-4 w-4 text-primary" />
              </div>
              <Label htmlFor="email-invoices" className="cursor-pointer">
                <p className="text-sm font-medium text-foreground">
                  Email invoices
                </p>
                <p className="text-sm text-muted-foreground">
                  Receive invoices via email
                </p>
              </Label>
            </div>
            <Switch
              id="email-invoices"
              checked={true}
              onCheckedChange={() => {}}
              aria-label="Enable email invoices"
            />
          </div>

          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download Latest Invoice
          </Button>
        </div>
      </DetailCard>
    </div>
  </motion.div>
)
