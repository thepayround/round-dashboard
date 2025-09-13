import React from 'react'
import { motion } from 'framer-motion'
import { Card, ActionButton } from '@/shared/components'
import { 
  CreditCard, 
  Download, 
  Edit3, 
  Plus,
  CheckCircle,
  Building
} from 'lucide-react'

export const BillingSection: React.FC = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-4"
    >
      {/* Billing Overview */}
      <Card animate={false} padding="md">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-green-500/15 to-emerald-500/15 rounded-lg border border-green-500/20">
            <CreditCard className="w-3 h-3 text-green-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-xs font-medium text-white mb-1">Billing & Payments</h2>
            <p className="text-[11px] text-gray-400">
              Manage your payment methods and billing information
            </p>
          </div>
        </div>

        {/* Current Plan */}
        <div className="p-3 bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-blue-500/20 rounded-lg mb-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-xs font-medium text-white mb-0.5">Professional Plan</h3>
              <p className="text-[10px] text-gray-400">Billed monthly • Next billing: March 15, 2024</p>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-white">$49</div>
              <div className="text-[10px] text-gray-400">per month</div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-green-400">
            <CheckCircle className="w-2.5 h-2.5" />
            <span className="text-[11px] font-medium">Active subscription</span>
          </div>
        </div>
      </Card>

      {/* Payment Methods */}
      <Card animate={false} padding="md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xs font-medium text-white mb-1">Payment Methods</h3>
            <p className="text-[11px] text-gray-400">Manage your saved payment methods</p>
          </div>
          <ActionButton
            label="Add Payment Method"
            icon={Plus}
            variant="secondary"
            size="sm"
            onClick={() => {}}
            className="h-7 px-3 text-[11px]"
          />
        </div>

        {/* Payment Method Card */}
        <div className="space-y-3">
          <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-blue-500/20 rounded-lg">
                  <CreditCard className="w-3 h-3 text-blue-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-white font-medium text-xs">•••• •••• •••• 4242</span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-green-500/15 border border-green-400/20 rounded-full text-green-400 text-[10px]">
                      <div className="w-1 h-1 bg-green-400 rounded-full" />
                      Primary
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] text-gray-400">
                    <span>Expires 12/24</span>
                    <span>Visa</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="text-[#D417C8] hover:text-[#BD2CD0] text-[11px] font-medium transition-colors duration-200">
                  Edit
                </button>
                <button className="text-gray-400 hover:text-gray-300 text-[11px] font-medium transition-colors duration-200">
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Billing Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Billing Address */}
        <Card animate={false} padding="md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Building className="w-3 h-3 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xs font-medium text-white">Billing Address</h3>
                <p className="text-[11px] text-gray-400">Your billing information</p>
              </div>
            </div>
            <ActionButton
              label="Edit"
              icon={Edit3}
              variant="secondary"
              size="sm"
              onClick={() => {}}
            />
          </div>

          <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
            <div className="space-y-1 text-[11px] text-gray-300">
              <p className="text-white font-medium text-xs">Acme Corporation</p>
              <p>123 Business Street</p>
              <p>Suite 100</p>
              <p>San Francisco, CA 94105</p>
              <p>United States</p>
            </div>
          </div>
        </Card>

        {/* Invoice Preferences */}
        <Card animate={false} padding="md">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Download className="w-3 h-3 text-orange-400" />
            </div>
            <div>
              <h3 className="text-xs font-medium text-white">Invoice Preferences</h3>
              <p className="text-[11px] text-gray-400">How you receive invoices</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-blue-500/20 rounded-lg">
                  <Download className="w-3 h-3 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-white">Email invoices</p>
                  <p className="text-[11px] text-gray-400">Receive invoices via email</p>
                </div>
              </div>
              <label htmlFor="email-invoices-toggle" className="relative inline-flex items-center cursor-pointer">
                <span className="sr-only">Enable email invoices</span>
                <input id="email-invoices-toggle" type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-8 h-5 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#D417C8]/20 rounded-full peer peer-checked:after:translate-x-3 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#D417C8] peer-checked:to-[#14BDEA]" />
              </label>
            </div>

            <div className="flex gap-3">
              <ActionButton
                label="Download Latest Invoice"
                icon={Download}
                variant="secondary"
                size="sm"
                onClick={() => {}}
                className="text-[11px]"
              />
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  )
