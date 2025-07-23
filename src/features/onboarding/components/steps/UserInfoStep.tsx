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

  const isFormValid = () =>
    data.firstName.trim() !== '' &&
    data.lastName.trim() !== '' &&
    data.email.trim() !== '' &&
    data.phone.trim() !== ''

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
          className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#D417C8]/20 to-[#14BDEA]/20 backdrop-blur-sm border border-white/20 flex items-center justify-center"
        >
          <User className="w-8 h-8 text-[#D417C8]" />
        </motion.div>

        <div>
          <h2 className="text-3xl font-bold text-white mb-2">User Information</h2>
          <p className="text-gray-400 text-lg">
            {isPrePopulated
              ? 'Your information has been automatically filled'
              : 'Tell us about yourself'}
          </p>
          {isPrePopulated && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-[#42E695]/20 to-[#3BB2B8]/20 border border-[#42E695]/30"
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
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
              First Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="firstName"
                type="text"
                value={data.firstName}
                onChange={handleInputChange('firstName')}
                placeholder="John"
                className={`
                  w-full h-12 pl-12 pr-4 rounded-xl backdrop-blur-xl border transition-all duration-200
                  bg-white/5 border-white/10 text-white placeholder-gray-400
                  focus:bg-white/10 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-[#D417C8]/30
                  ${errors.firstName ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' : ''}
                `}
              />
            </div>
            {errors.firstName && <p className="mt-1 text-sm text-red-400">{errors.firstName}</p>}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
              Last Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="lastName"
                type="text"
                value={data.lastName}
                onChange={handleInputChange('lastName')}
                placeholder="Doe"
                className={`
                  w-full h-12 pl-12 pr-4 rounded-xl backdrop-blur-xl border transition-all duration-200
                  bg-white/5 border-white/10 text-white placeholder-gray-400
                  focus:bg-white/10 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-[#D417C8]/30
                  ${errors.lastName ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' : ''}
                `}
              />
            </div>
            {errors.lastName && <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>}
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="email"
              type="email"
              value={data.email}
              onChange={handleInputChange('email')}
              placeholder="john@example.com"
              className={`
                w-full h-12 pl-12 pr-4 rounded-xl backdrop-blur-xl border transition-all duration-200
                bg-white/5 border-white/10 text-white placeholder-gray-400
                focus:bg-white/10 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-[#D417C8]/30
                ${errors.email ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' : ''}
              `}
            />
          </div>
          {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="phone"
              type="tel"
              value={data.phone}
              onChange={handleInputChange('phone')}
              placeholder="+1 (555) 123-4567"
              className={`
                w-full h-12 pl-12 pr-4 rounded-xl backdrop-blur-xl border transition-all duration-200
                bg-white/5 border-white/10 text-white placeholder-gray-400
                focus:bg-white/10 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-[#D417C8]/30
                ${errors.phone ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' : ''}
              `}
            />
          </div>
          {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone}</p>}
        </div>
      </div>

      {/* Form Validation Status */}
      {isFormValid() && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-xl bg-gradient-to-r from-[#42E695]/10 to-[#3BB2B8]/10 border border-[#42E695]/20"
        >
          <p className="text-[#42E695] text-sm font-medium text-center">
            ✓ All information completed successfully
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}
