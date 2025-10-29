import { motion } from 'framer-motion'
import { CreditCard, ExternalLink, CheckCircle } from 'lucide-react'
import type { BillingSettings } from '../../types/onboarding'

interface BillingStepProps {
  data: BillingSettings
  onChange: (data: BillingSettings) => void
}

export const BillingStep = ({ data, onChange }: BillingStepProps) => {
  const handleConnectStripe = () => {
    // This would typically redirect to Stripe Connect or open integration flow
    onChange({
      ...data,
      isConnected: true,
      provider: 'stripe',
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-16 h-16 mx-auto rounded-lg bg-primary/20 border border-white/20 flex items-center justify-center"
        >
          <CreditCard className="w-8 h-8 text-[#BD2CD0]" />
        </motion.div>

        <div>
          <h2 className="text-lg font-medium tracking-tight text-white mb-2">Billing</h2>
          <p className="text-gray-400 text-sm">Connect your payment method</p>
        </div>
      </div>

      {/* Connect Payment Method Section */}
      <div className="space-y-6">
        {!data.isConnected ? (
          <div className="text-center space-y-6">
            <div className="p-8">
              <div className="space-y-6">
                {/* Stripe Logo & Info */}
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-[#635BFF]/20 flex items-center justify-center">
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"
                        fill="#635BFF"
                      />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-normal tracking-tight text-white">Connect with Stripe</h3>
                    <p className="text-gray-400 text-xs">Secure payment processing for your business</p>
                  </div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-[#42E695]" />
                    <span className="text-sm text-gray-300">Accept credit & debit cards</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-[#42E695]" />
                    <span className="text-sm text-gray-300">Automated recurring billing</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-[#42E695]" />
                    <span className="text-sm text-gray-300">Global payment methods</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-[#42E695]" />
                    <span className="text-sm text-gray-300">Advanced fraud protection</span>
                  </div>
                </div>

                <button
                  onClick={handleConnectStripe}
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg bg-primary text-white font-medium hover:shadow-lg hover:shadow-[#D417C8]/30 transition-all duration-200 transform hover:scale-105"
                >
                  <span>Connect Stripe</span>
                  <ExternalLink className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="p-8 rounded-lg bg-primary/10 border border-accent/20">
              <div className="space-y-4">
                <div className="w-12 h-12 mx-auto rounded-lg bg-[#42E695]/20 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-[#42E695]" />
                </div>

                <div>
                  <h3 className="text-sm font-normal tracking-tight text-white mb-2">
                    Payment Method Connected
                  </h3>
                  <p className="text-gray-400">
                    Your Stripe account has been successfully connected. You&apos;re ready to start
                    accepting payments!
                  </p>
                </div>

                <div className="flex items-center justify-center space-x-2 text-[#42E695]">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Stripe Connected</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Skip Option */}
        <div className="text-center">
          <p className="text-sm text-gray-400">
            You can set up payment processing later in your billing settings
          </p>
        </div>
      </div>
    </motion.div>
  )
}
