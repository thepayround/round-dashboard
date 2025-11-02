import { motion } from 'framer-motion'
import { User, Mail, Phone } from 'lucide-react'

import type { UserInfo } from '../../types/onboarding'

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
  const handleInputChange = (field: keyof UserInfo) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...data,
      [field]: e.target.value,
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
          <User className="w-8 h-8 text-[#D417C8]" />
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
              className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-primary/20 border border-accent/30"
            >
              <span className="text-[#42E695] text-sm font-medium">
                ✓ Auto-completed from your account
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Name Fields Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="auth-label">
              First Name
            </label>
            <div className="input-container">
              <User className="input-icon-left auth-icon-primary" />
              <input
                id="firstName"
                type="text"
                value={data.firstName}
                onChange={handleInputChange('firstName')}
                placeholder="John"
                className={`auth-input input-with-icon-left ${errors.firstName ? 'auth-input-error' : ''}`}
              />
            </div>
            {errors.firstName && <p className="mt-1 text-sm text-red-400">{errors.firstName}</p>}
          </div>

          <div>
            <label htmlFor="lastName" className="auth-label">
              Last Name
            </label>
            <div className="input-container">
              <User className="input-icon-left auth-icon-primary" />
              <input
                id="lastName"
                type="text"
                value={data.lastName}
                onChange={handleInputChange('lastName')}
                placeholder="Doe"
                className={`auth-input input-with-icon-left ${errors.lastName ? 'auth-input-error' : ''}`}
              />
            </div>
            {errors.lastName && <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>}
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="auth-label">
            Email Address
          </label>
          <div className="input-container">
            <Mail className="input-icon-left auth-icon-primary" />
            <input
              id="email"
              type="email"
              value={data.email}
              onChange={handleInputChange('email')}
              placeholder="john@example.com"
              className={`auth-input input-with-icon-left ${errors.email ? 'auth-input-error' : ''}`}
            />
          </div>
          {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="auth-label">
            Phone Number
          </label>
          <div className="input-container">
            <Phone className="input-icon-left auth-icon-primary" />
            <input
              id="phone"
              type="tel"
              value={data.phone}
              onChange={handleInputChange('phone')}
              placeholder="+1 (555) 123-4567"
              className={`auth-input input-with-icon-left ${errors.phone ? 'auth-input-error' : ''}`}
            />
          </div>
          {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone}</p>}
        </div>
      </div>
    </motion.div>
  )
}
