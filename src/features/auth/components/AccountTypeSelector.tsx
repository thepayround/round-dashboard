import { motion } from 'framer-motion'
import { User, Building, ArrowRight, CheckCircle } from 'lucide-react'

import type { AccountType } from '@/shared/types/auth'

interface AccountTypeOption {
  type: AccountType
  icon: typeof User
  title: string
  description: string
  features: string[]
  color: string
  gradient: string
}

interface AccountTypeSelectorProps {
  selectedType: AccountType | null
  onTypeSelect: (type: AccountType) => void
  onContinue: () => void
}

const ACCOUNT_TYPES: AccountTypeOption[] = [
  {
    type: 'personal',
    icon: User,
    title: 'Personal Account',
    description: 'Perfect for individual users and personal projects',
    features: [
      'Personal billing and invoicing',
      'Basic subscription management',
      'Individual usage tracking',
      'Personal dashboard',
      'Email support',
    ],
    color: 'from-blue-500 to-purple-600',
    gradient: 'bg-gradient-to-br from-blue-500/20 to-purple-600/20',
  },
  {
    type: 'business',
    icon: Building,
    title: 'Business Account',
    description: 'Designed for companies and organizations',
    features: [
      'Company billing and invoicing',
      'Advanced subscription management',
      'Multi-user usage tracking',
      'Team collaboration tools',
      'Priority support',
      'Custom billing addresses',
      'Tax compliance features',
    ],
    color: 'from-emerald-500 to-teal-600',
    gradient: 'bg-gradient-to-br from-emerald-500/20 to-teal-600/20',
  },
]

export const AccountTypeSelector = ({
  selectedType,
  onTypeSelect,
  onContinue,
}: AccountTypeSelectorProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="w-full max-w-4xl mx-auto"
  >
    {/* Header */}
    <div className="text-center mb-8">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl font-bold auth-text mb-3"
      >
        Choose Your Account Type
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="auth-text-muted text-lg"
      >
        Select the account type that best fits your needs
      </motion.p>
    </div>

    {/* Account Type Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {ACCOUNT_TYPES.map((accountType, index) => {
        const Icon = accountType.icon
        const isSelected = selectedType === accountType.type

        return (
          <motion.div
            key={accountType.type}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className={`
                relative p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer
                ${
                  isSelected
                    ? 'border-white/30 bg-white/10 shadow-lg shadow-white/10'
                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8'
                }
              `}
            onClick={() => onTypeSelect(accountType.type)}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            data-testid={`account-type-${accountType.type}`}
          >
            {/* Selection Indicator */}
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center"
                data-testid="selection-indicator"
              >
                <CheckCircle className="w-4 h-4 text-white" />
              </motion.div>
            )}

            {/* Icon and Title */}
            <div className="flex items-center mb-4">
              <div className={`p-3 rounded-lg ${accountType.gradient} mr-4`}>
                <Icon
                  className={`w-6 h-6 bg-gradient-to-r ${accountType.color} bg-clip-text text-transparent`}
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">{accountType.title}</h3>
                <p className="text-sm text-gray-300">{accountType.description}</p>
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-2">
              {accountType.features.map((feature, featureIndex) => (
                <div key={featureIndex} className="flex items-center text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mr-2 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* Gradient Border Effect */}
            <div
              className={`
                absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300
                ${isSelected ? 'opacity-100' : 'group-hover:opacity-50'}
                bg-gradient-to-r ${accountType.color} p-[1px]
              `}
            >
              <div className="w-full h-full rounded-xl bg-transparent" />
            </div>
          </motion.div>
        )
      })}
    </div>

    {/* Continue Button */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="text-center"
    >
      <motion.button
        onClick={onContinue}
        disabled={!selectedType}
        whileHover={{ scale: selectedType ? 1.05 : 1 }}
        whileTap={{ scale: selectedType ? 0.95 : 1 }}
        className={`
            px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300
            ${
              selectedType
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-lg hover:shadow-emerald-500/25'
                : 'bg-white/10 text-gray-400 cursor-not-allowed'
            }
          `}
      >
        <span className="flex items-center justify-center space-x-2">
          <span>Continue</span>
          <ArrowRight className="w-5 h-5" />
        </span>
      </motion.button>
    </motion.div>
  </motion.div>
)
