import { motion } from 'framer-motion'
import { User, Mail, Phone } from 'lucide-react'

import { useUserInfoStepController } from '../../hooks/useUserInfoStepController'
import type { UserInfo } from '../../types/onboarding'

import { Input, Badge } from '@/shared/ui'

interface UserInfoStepProps {
  data: UserInfo
  onChange: (data: UserInfo) => void
  errors?: Record<string, string>
  isPrePopulated?: boolean
}

export const UserInfoStep = ({
  data,
  onChange,
  errors = {},
  isPrePopulated = false,
}: UserInfoStepProps) => {
  const { handleInputChange } = useUserInfoStepController({ data, onChange })


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
          <User className="w-8 h-8 text-primary" />
        </motion.div>

        <div>
          <h2 className="text-lg font-medium tracking-tight text-white mb-2">User Information</h2>
          <p className="text-gray-400 text-sm">
            {isPrePopulated
              ? 'Your information has been automatically filled'
              : 'Tell us about yourself'}
          </p>
          {isPrePopulated && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-3"
            >
              <Badge variant="success" size="lg">
                ✓ Auto-completed from your account
              </Badge>
            </motion.div>
          )}
        </div>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Name Fields Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Input
              id="firstName"
              value={data.firstName}
              onChange={handleInputChange('firstName')}
              placeholder="John"
              label="First Name"
              leftIcon={User}
              error={errors.firstName}
            />
          </div>

          <div>
            <Input
              id="lastName"
              value={data.lastName}
              onChange={handleInputChange('lastName')}
              placeholder="Doe"
              label="Last Name"
              leftIcon={User}
              error={errors.lastName}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={handleInputChange('email')}
            placeholder="john@example.com"
            label="Email Address"
            leftIcon={Mail}
            error={errors.email}
          />
        </div>

        {/* Phone */}
        <div>
          <Input
            id="phone"
            type="tel"
            value={data.phone}
            onChange={handleInputChange('phone')}
            placeholder="+1 (555) 123-4567"
            label="Phone Number"
            leftIcon={Phone}
            error={errors.phone}
          />
        </div>
      </div>
    </motion.div>
  )
}
