import { motion } from 'framer-motion'
import { User, Building, ArrowRight } from 'lucide-react'

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
    title: '👤 Personal Account',
    description: '',
    features: [],
    color: 'from-blue-500 to-purple-600',
    gradient: 'bg-gradient-to-br from-blue-500/20 to-purple-600/20',
  },
  {
    type: 'business',
    icon: Building,
    title: '🏢 Business Account',
    description: '',
    features: [],
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
        const isSelected = selectedType === accountType.type

        return (
          <motion.div
            key={accountType.type}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className={`
                relative p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer bg-white/5
                ${isSelected ? 'border-emerald-500' : 'border-white/10 hover:border-white/20'}
              `}
            onClick={() => onTypeSelect(accountType.type)}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            data-testid={`account-type-${accountType.type}`}
          >
            {/* Title */}
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-white">{accountType.title}</h3>
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
