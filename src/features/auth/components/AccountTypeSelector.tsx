import { User, Building } from 'lucide-react'

import type { AccountType } from '@/shared/types/auth'

interface AccountTypeOption {
  type: AccountType
  icon: typeof User
  title: string
  description: string
  features: string[]
  gradient: string
  glowColor: string
  iconBg: string
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
    title: 'Personal',
    description: '',
    features: [],
    gradient: 'from-[#D417C8] via-[#7767DA] to-[#14BDEA]',
    glowColor: 'rgba(212, 23, 200, 0.3)',
    iconBg: 'bg-gradient-to-br from-[#D417C8]/20 to-[#7767DA]/20',
  },
  {
    type: 'business',
    icon: Building,
    title: 'Business',
    description: '',
    features: [],
    gradient: 'from-[#14BDEA] via-[#7767DA] to-[#D417C8]',
    glowColor: 'rgba(20, 189, 234, 0.3)',
    iconBg: 'bg-gradient-to-br from-[#14BDEA]/20 to-[#7767DA]/20',
  },
]

export const AccountTypeSelector = ({
  selectedType: _selectedType,
  onTypeSelect,
  onContinue: _onContinue,
}: AccountTypeSelectorProps) => (
  <div className="w-full max-w-4xl mx-auto">
    {/* Header with animated gradient text */}
    <div className="text-center mb-16">
      <div className="relative">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-[#D417C8] via-[#7767DA] to-[#14BDEA] bg-clip-text text-transparent mb-6 leading-tight">
          Choose Your Journey
        </h1>
      </div>
      <p className="text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
        Select your account type
      </p>
    </div>

    {/* Account Type Cards */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      {ACCOUNT_TYPES.map(accountType => (
        <button
          key={accountType.type}
          type="button"
          className="relative group cursor-pointer transition-all duration-500 transform w-full text-left hover:scale-102"
          onClick={() => onTypeSelect(accountType.type)}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onTypeSelect(accountType.type)
            }
          }}
          aria-label={`Continue with ${accountType.title} account type`}
        >
          {/* Glow effect */}
          <div
            className="absolute inset-0 rounded-2xl blur-xl transition-all duration-500 opacity-20 group-hover:opacity-40"
            style={{
              background: `linear-gradient(135deg, ${accountType.gradient.replace('from-[', '').replace('] via-[', ', ').replace('] to-[', ', ').replace(']', '')})`,
            }}
          />

          {/* Card */}
          <div className="relative backdrop-blur-xl rounded-2xl p-8 border transition-all duration-500 bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20">
            {/* Icon with gradient background */}
            <div className="flex justify-center mb-6">
              <div
                className={`
                  w-20 h-20 rounded-2xl flex items-center justify-center relative overflow-hidden
                  ${accountType.iconBg}
                  backdrop-blur-sm border border-white/20
                `}
              >
                <accountType.icon className="w-10 h-10 text-white drop-shadow-lg" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              </div>
            </div>

            {/* Content */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white">{accountType.title}</h3>
            </div>

            {/* Bottom gradient line */}
            <div
              className={`
                h-1 rounded-full mt-6 transition-all duration-500
                bg-gradient-to-r ${accountType.gradient}
                opacity-40 group-hover:opacity-70
              `}
            />
          </div>
        </button>
      ))}
    </div>
  </div>
)
