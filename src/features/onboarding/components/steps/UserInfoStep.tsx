import { motion } from 'framer-motion'
import { AlertCircle, User, Mail, Phone } from 'lucide-react'

import { useUserInfoStepController } from '../../hooks/useUserInfoStepController'
import type { UserInfo } from '../../types/onboarding'

import { Badge } from '@/shared/ui/shadcn/badge'
import { Input } from '@/shared/ui/shadcn/input'
import { Label } from '@/shared/ui/shadcn/label'

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
              <Badge variant="secondary" className="text-sm px-3 py-1">
                ✓ Auto-completed from your account
              </Badge>
            </motion.div>
          )}
        </div>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Name Fields Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-xs font-normal text-gray-400">
              First Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="firstName"
                value={data.firstName}
                onChange={handleInputChange('firstName')}
                placeholder="John"
                className="pl-10"
                aria-invalid={!!errors.firstName}
                aria-describedby={errors.firstName ? 'firstName-error' : undefined}
              />
            </div>
            {errors.firstName && (
              <div id="firstName-error" className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.firstName}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-xs font-normal text-gray-400">
              Last Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="lastName"
                value={data.lastName}
                onChange={handleInputChange('lastName')}
                placeholder="Doe"
                className="pl-10"
                aria-invalid={!!errors.lastName}
                aria-describedby={errors.lastName ? 'lastName-error' : undefined}
              />
            </div>
            {errors.lastName && (
              <div id="lastName-error" className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.lastName}</span>
              </div>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs font-normal text-gray-400">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={handleInputChange('email')}
              placeholder="john@example.com"
              className="pl-10"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
          </div>
          {errors.email && (
            <div id="email-error" className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{errors.email}</span>
            </div>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-xs font-normal text-gray-400">
            Phone Number
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="phone"
              type="tel"
              value={data.phone}
              onChange={handleInputChange('phone')}
              placeholder="+1 (555) 123-4567"
              className="pl-10"
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
            />
          </div>
          {errors.phone && (
            <div id="phone-error" className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{errors.phone}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
