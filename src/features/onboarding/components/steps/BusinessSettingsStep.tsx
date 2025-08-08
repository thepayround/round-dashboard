import { motion } from 'framer-motion'
import { Settings } from 'lucide-react'
import type { BusinessSettings } from '../../types/onboarding'
import { 
  ApiDropdown, 
  currencyDropdownConfig, 
  timezoneDropdownConfig, 
  fiscalYearDropdownConfig 
} from '@/shared/components/ui/ApiDropdown'

interface BusinessSettingsStepProps {
  data: BusinessSettings
  onChange: (data: BusinessSettings) => void
  errors?: Record<string, string>
}

export const BusinessSettingsStep = ({
  data,
  onChange,
  errors = {},
}: BusinessSettingsStepProps) => {

  const handleSelectChange = (field: keyof BusinessSettings, value: string) => {
    onChange({
      ...data,
      [field]: value,
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
          className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#7767DA]/20 to-[#BD2CD0]/20 backdrop-blur-sm border border-white/20 flex items-center justify-center"
        >
          <Settings className="w-8 h-8 text-[#7767DA]" />
        </motion.div>

        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Business Settings</h2>
          <p className="text-gray-400 text-lg">Configure your business preferences</p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-lg mx-auto space-y-6">
        {/* Currency */}
        <div>
          <span className="block text-sm font-medium text-gray-300 mb-2">Currency</span>
          <ApiDropdown
            config={currencyDropdownConfig}
            value={data.currency}
            onSelect={value => handleSelectChange('currency', value)}
            error={!!errors.currency}
            allowClear={false}
          />
          {errors.currency && <p className="mt-1 text-sm text-red-400">{errors.currency}</p>}
        </div>

        {/* Timezone */}
        <div>
          <span className="block text-sm font-medium text-gray-300 mb-2">Timezone</span>
          <ApiDropdown
            config={timezoneDropdownConfig}
            value={data.timezone}
            onSelect={value => handleSelectChange('timezone', value)}
            error={!!errors.timezone}
            allowClear={false}
          />
          {errors.timezone && <p className="mt-1 text-sm text-red-400">{errors.timezone}</p>}
        </div>

        {/* Fiscal Year Start */}
        <div>
          <span className="block text-sm font-medium text-gray-300 mb-2">Fiscal Year Start</span>
          <ApiDropdown
            config={fiscalYearDropdownConfig}
            value={data.fiscalYearStart}
            onSelect={value => handleSelectChange('fiscalYearStart', value)}
            error={!!errors.fiscalYearStart}
            allowClear={false}
          />
          {errors.fiscalYearStart && (
            <p className="mt-1 text-sm text-red-400">{errors.fiscalYearStart}</p>
          )}
        </div>
      </div>
    </motion.div>
  )
}
