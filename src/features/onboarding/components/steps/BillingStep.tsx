import { motion } from 'framer-motion'
import { CreditCard, ExternalLink, CheckCircle } from 'lucide-react'

import type { StepComponentProps } from '../../config/types'
import { useBillingStepController } from '../../hooks/useBillingStepController'
import type { BillingSettings } from '../../types/onboarding'

import { DetailCard } from '@/shared/ui/DetailCard'
import { Button } from '@/shared/ui/shadcn/button'

type BillingStepProps = StepComponentProps<BillingSettings>

export const BillingStep = ({ data, onChange }: BillingStepProps) => {
  const { isConnected, handleConnect } = useBillingStepController({ data, onChange })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1 text-center">
        <h2 className="text-base font-medium text-foreground">Billing</h2>
        <p className="text-sm text-muted-foreground">Connect your payment method</p>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        <DetailCard
          title="Payment Processing"
          icon={<CreditCard className="h-4 w-4" />}
        >
          <div className="space-y-6">
            {isConnected ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-lg bg-success/5 border border-success/20"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-foreground mb-1">
                      Payment Method Connected
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Your Stripe account has been successfully connected. You&apos;re ready to start accepting payments!
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="p-6 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"
                        className="fill-primary"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-foreground">Connect with Stripe</h3>
                    <p className="text-sm text-muted-foreground">Secure payment processing for your business</p>
                  </div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success shrink-0" />
                    <span className="text-sm text-muted-foreground">Accept credit & debit cards</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success shrink-0" />
                    <span className="text-sm text-muted-foreground">Automated recurring billing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success shrink-0" />
                    <span className="text-sm text-muted-foreground">Global payment methods</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success shrink-0" />
                    <span className="text-sm text-muted-foreground">Advanced fraud protection</span>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handleConnect}
                  variant="default"
                  className="gap-2"
                >
                  Connect Stripe
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            )}

            <p className="text-xs text-muted-foreground text-center pt-2">
              You can set up payment processing later in your billing settings
            </p>
          </div>
        </DetailCard>
      </div>
    </div>
  )
}

