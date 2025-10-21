import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Zap, 
  DollarSign, 
  Calendar, 
  Repeat,
  Check,
  Plus,
  Trash2,
  Settings,
  Target,
  Globe
} from 'lucide-react'
import { UiDropdown, type UiDropdownOption } from '@/shared/components/ui/UiDropdown'
import { ApiDropdown } from '@/shared/components/ui/ApiDropdown'
import { currencyDropdownConfig } from '@/shared/components/ui/ApiDropdown/configs'
import { useCurrency } from '@/shared/hooks/useCurrency'
import type {
  Charge,
  ChargeType,
  ChargePeriod,
  ChargeModel
} from '../types/catalog.types'

interface CreateChargeModalEnhancedProps {
  isOpen: boolean
  onClose: () => void
  existingCharge?: Charge
}

const chargeTypes: { value: ChargeType; label: string; description: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { 
    value: 'one_time', 
    label: 'One-time Charge', 
    description: 'Single charge applied once', 
    icon: Zap 
  },
  { 
    value: 'recurring', 
    label: 'Recurring Charge', 
    description: 'Charge that repeats at regular intervals', 
    icon: Repeat 
  },
  { 
    value: 'usage_based', 
    label: 'Usage-based Charge', 
    description: 'Charge based on actual usage or consumption', 
    icon: Target 
  }
]

const chargePeriodOptions: UiDropdownOption[] = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'semi_annually', label: 'Semi-annually' },
  { value: 'annually', label: 'Annually' }
]

const chargeModels: { value: ChargeModel; label: string; description: string }[] = [
  { value: 'flat_fee', label: 'Flat Fee', description: 'Fixed amount regardless of usage' },
  { value: 'per_unit', label: 'Per Unit', description: 'Price per unit consumed' },
  { value: 'tiered', label: 'Tiered Pricing', description: 'Different prices for different tiers' },
  { value: 'volume', label: 'Volume Pricing', description: 'Bulk pricing based on total volume' },
  { value: 'percentage', label: 'Percentage', description: 'Percentage of a base amount' }
]


export const CreateChargeModalEnhanced = ({
  isOpen,
  onClose,
  existingCharge
}: CreateChargeModalEnhancedProps) => {
  const { getCurrencySymbol } = useCurrency()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: existingCharge?.name ?? '',
    description: existingCharge?.description ?? '',
    chargeType: (existingCharge?.chargeType as ChargeType) ?? 'one_time' as ChargeType,
    chargeModel: 'flat_fee' as ChargeModel,
    amount: existingCharge?.amount ?? 0,
    currency: existingCharge?.currency ?? 'USD',
    period: 'monthly' as ChargePeriod,
    unitName: '',
    unitPrice: 0,
    tiers: [
      { startingUnit: 1, endingUnit: 100, pricePerUnit: 0 },
      { startingUnit: 101, endingUnit: 500, pricePerUnit: 0 }
    ],
    percentageOf: '',
    percentageValue: 0,
    isProrated: false,
    taxable: true,
    taxConfiguration: {
      taxInclusive: false,
      taxCode: '',
      exemptionCode: ''
    },
    accounting: {
      revenueAccount: '',
      deferredRevenueAccount: '',
      costCenter: ''
    },
    applicableCountries: [] as string[],
    excludedCountries: [] as string[],
    minimumCharge: undefined as number | undefined,
    maximumCharge: undefined as number | undefined,
    freeUnits: 0,
    invoiceDisplayName: '',
    invoiceDescription: ''
  })

  const [customCountry, setCustomCountry] = useState('')

  const steps = [
    { number: 1, title: 'Basic Info', icon: Zap },
    { number: 2, title: 'Pricing Model', icon: DollarSign },
    { number: 3, title: 'Configuration', icon: Settings },
    { number: 4, title: 'Review', icon: Check }
  ]

  const _handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1)
    }
  }

  const _handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const _addTier = () => {
    const lastTier = formData.tiers[formData.tiers.length - 1]
    setFormData({
      ...formData,
      tiers: [
        ...formData.tiers,
        {
          startingUnit: lastTier.endingUnit + 1,
          endingUnit: lastTier.endingUnit + 100,
          pricePerUnit: 0
        }
      ]
    })
  }

  const removeTier = (index: number) => {
    if (formData.tiers.length > 1) {
      setFormData({
        ...formData,
        tiers: formData.tiers.filter((_, i) => i !== index)
      })
    }
  }

  const updateTier = (index: number, field: string, value: number) => {
    const newTiers = [...formData.tiers]
    newTiers[index] = { ...newTiers[index], [field]: value }
    setFormData({ ...formData, tiers: newTiers })
  }

  const addCountry = (type: 'applicable' | 'excluded') => {
    if (customCountry.trim()) {
      const field = type === 'applicable' ? 'applicableCountries' : 'excludedCountries'
      const otherField = type === 'applicable' ? 'excludedCountries' : 'applicableCountries'
      
      // Remove from other list if exists
      const newOtherList = formData[otherField].filter(country => country !== customCountry.trim())
      
      setFormData({
        ...formData,
        [field]: [...formData[field], customCountry.trim()],
        [otherField]: newOtherList
      })
      setCustomCountry('')
    }
  }

  const removeCountry = (country: string, type: 'applicable' | 'excluded') => {
    const field = type === 'applicable' ? 'applicableCountries' : 'excludedCountries'
    setFormData({
      ...formData,
      [field]: formData[field].filter(c => c !== country)
    })
  }

  const _handleSubmit = () => {
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-card w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-warning rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-medium tracking-tight auth-text">
                  {existingCharge ? 'Edit Charge' : 'Create New Charge'}
                </h2>
                <p className="auth-text-muted">Step {step} of {steps.length}: {steps[step - 1].title}</p>
              </div>
            </div>
            <button className="btn-secondary">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="px-6 py-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              {steps.map((stepItem, index) => {
                // Determine step styling
                let stepCircleStyle = '';
                if (step > stepItem.number) {
                  stepCircleStyle = 'bg-green-500 text-white';
                } else if (step === stepItem.number) {
                  stepCircleStyle = 'bg-warning text-white';
                } else {
                  stepCircleStyle = 'bg-white/10 text-white/50';
                }

                return (
                  <div key={stepItem.number} className="flex items-center">
                    <div className={`flex items-center space-x-2 ${
                      step >= stepItem.number ? 'text-white' : 'text-white/50'
                    }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${stepCircleStyle}`}>
                      {step > stepItem.number ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <stepItem.icon className="w-4 h-4" />
                      )}
                    </div>
                    <span className="text-sm font-normal tracking-tight hidden sm:inline">
                      {stepItem.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-4 ${
                      step > stepItem.number ? 'bg-green-500' : 'bg-white/20'
                    }`} />
                  )}
                </div>
                );
              })}
            </div>
          </div>

          {/* Step Content */}
          <div className="p-6">
            {step === 1 && (
              <div className="space-y-6">
                <h3 className="text-xl font-medium tracking-tight auth-text mb-4">Basic Charge Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label htmlFor="charge-name" className="block text-sm font-normal tracking-tight auth-text mb-2">
                      Charge Name *
                    </label>
                    <input
                      id="charge-name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="auth-input w-full"
                      placeholder="Setup Fee, API Usage, Premium Support"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="charge-description" className="block text-sm font-normal tracking-tight auth-text mb-2">
                      Description
                    </label>
                    <textarea
                      id="charge-description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="auth-input w-full h-24 resize-none"
                      placeholder="Describe this charge and when it applies..."
                    />
                  </div>

                  <div>
                    <div className="block text-sm font-normal tracking-tight auth-text mb-2">
                      Currency *
                    </div>
                    <ApiDropdown
                      config={currencyDropdownConfig}
                      value={formData.currency}
                      onSelect={(value) => setFormData({ ...formData, currency: value })}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label htmlFor="charge-invoice-display-name" className="block text-sm font-normal tracking-tight auth-text mb-2">
                      Invoice Display Name
                    </label>
                    <input
                      id="charge-invoice-display-name"
                      type="text"
                      value={formData.invoiceDisplayName}
                      onChange={(e) => setFormData({ ...formData, invoiceDisplayName: e.target.value })}
                      className="auth-input w-full"
                      placeholder="Name shown on customer invoices"
                    />
                  </div>
                </div>

                {/* Charge Type Selection */}
                <div className="space-y-4">
                  <label htmlFor="charge-type" className="block text-sm font-normal tracking-tight auth-text mb-2">
                    Charge Type *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {chargeTypes.map(type => (
                      <motion.button
                        key={type.value}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFormData({ ...formData, chargeType: type.value })}
                        className={`p-4 rounded-lg border text-left transition-all ${
                          formData.chargeType === type.value
                            ? 'border-[#D417C8] bg-[#D417C8]/10 text-white'
                            : 'border-white/20 bg-white/5 text-white/70 hover:text-white hover:border-white/40'
                        }`}
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <type.icon className="w-5 h-5" />
                          <span className="font-medium">{type.label}</span>
                        </div>
                        <p className="text-sm opacity-70">{type.description}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Period for recurring charges */}
                {formData.chargeType === 'recurring' && (
                  <div>
                    <div className="block text-sm font-normal tracking-tight auth-text mb-2">
                      Billing Period *
                    </div>
                    <UiDropdown
                      options={chargePeriodOptions}
                      value={formData.period}
                      onSelect={(value) => setFormData({ ...formData, period: value as ChargePeriod })}
                      placeholder="Select billing period"
                      className="w-full md:w-64"
                    />
                  </div>
                )}

                {/* Proration for recurring charges */}
                {formData.chargeType === 'recurring' && (
                  <div>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.isProrated}
                        onChange={(e) => setFormData({ ...formData, isProrated: e.target.checked })}
                        className="auth-checkbox"
                        aria-label="Enable proration - Charge proportionally based on usage period"
                      />
                      <div>
                        <span className="text-sm font-normal tracking-tight auth-text">Enable proration</span>
                        <p className="text-xs auth-text-muted">
                          Charge proportionally based on usage period
                        </p>
                      </div>
                    </label>
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h3 className="text-xl font-medium tracking-tight auth-text mb-4">Pricing Model Configuration</h3>
                
                {/* Charge Model Selection */}
                <div className="space-y-4">
                  <label htmlFor="charge-pricing-model" className="block text-sm font-normal tracking-tight auth-text mb-2">
                    Pricing Model *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {chargeModels.map(model => (
                      <motion.button
                        key={model.value}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFormData({ ...formData, chargeModel: model.value })}
                        className={`p-4 rounded-lg border text-left transition-all ${
                          formData.chargeModel === model.value
                            ? 'border-[#D417C8] bg-[#D417C8]/10 text-white'
                            : 'border-white/20 bg-white/5 text-white/70 hover:text-white hover:border-white/40'
                        }`}
                      >
                        <div className="font-medium mb-1">{model.label}</div>
                        <p className="text-sm opacity-70">{model.description}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Flat Fee Configuration */}
                {formData.chargeModel === 'flat_fee' && (
                  <div className="glass-card p-6">
                    <h4 className="text-lg font-medium auth-text mb-4">Flat Fee Configuration</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="charge-amount" className="block text-sm font-normal tracking-tight auth-text mb-2">
                          Amount ({getCurrencySymbol(formData.currency)}) *
                        </label>
                        <input
                          id="charge-amount"
                          type="number"
                          value={formData.amount}
                          onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                          className="auth-input w-full"
                          min="0"
                          step="0.01"
                          placeholder="99.99"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Per Unit Configuration */}
                {formData.chargeModel === 'per_unit' && (
                  <div className="glass-card p-6">
                    <h4 className="text-lg font-medium auth-text mb-4">Per Unit Configuration</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label htmlFor="unitName" className="block text-sm font-normal tracking-tight auth-text mb-2">
                          Unit Name *
                        </label>
                        <input
                          id="unitName"
                          type="text"
                          value={formData.unitName}
                          onChange={(e) => setFormData({ ...formData, unitName: e.target.value })}
                          className="auth-input w-full"
                          placeholder="API Call, User, GB"
                        />
                      </div>
                      <div>
                        <label htmlFor="unitPrice" className="block text-sm font-normal tracking-tight auth-text mb-2">
                          Price per Unit ({getCurrencySymbol(formData.currency)}) *
                        </label>
                        <input
                          id="unitPrice"
                          type="number"
                          value={formData.unitPrice}
                          onChange={(e) => setFormData({ ...formData, unitPrice: Number(e.target.value) })}
                          className="auth-input w-full"
                          min="0"
                          step="0.001"
                          placeholder="0.10"
                        />
                      </div>
                      <div>
                        <label htmlFor="freeUnits" className="block text-sm font-normal tracking-tight auth-text mb-2">
                          Free Units
                        </label>
                        <input
                          id="freeUnits"
                          type="number"
                          value={formData.freeUnits}
                          onChange={(e) => setFormData({ ...formData, freeUnits: Number(e.target.value) })}
                          className="auth-input w-full"
                          min="0"
                          placeholder="100"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Tiered Configuration */}
                {formData.chargeModel === 'tiered' && (
                  <div className="glass-card p-6">
                    <h4 className="text-lg font-medium auth-text mb-4">Tiered Pricing Configuration</h4>
                    
                    <div className="mb-4">
                      <label htmlFor="tieredUnitName" className="block text-sm font-normal tracking-tight auth-text mb-2">
                        Unit Name *
                      </label>
                      <input
                        id="tieredUnitName"
                        type="text"
                        value={formData.unitName}
                        onChange={(e) => setFormData({ ...formData, unitName: e.target.value })}
                        className="auth-input w-full md:w-64"
                        placeholder="API Call, User, GB"
                      />
                    </div>

                    <div className="space-y-4">
                      {formData.tiers.map((tier, index) => (
                        <div key={index} className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg">
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label htmlFor={`startingUnit-${index}`} className="block text-xs auth-text-muted mb-1">Starting Unit</label>
                              <input
                                id={`startingUnit-${index}`}
                                type="number"
                                value={tier.startingUnit}
                                onChange={(e) => updateTier(index, 'startingUnit', Number(e.target.value))}
                                className="auth-input w-full text-sm"
                                min="1"
                              />
                            </div>
                            <div>
                              <label htmlFor={`endingUnit-${index}`} className="block text-xs auth-text-muted mb-1">Ending Unit</label>
                              <input
                                id={`endingUnit-${index}`}
                                type="number"
                                value={tier.endingUnit}
                                onChange={(e) => updateTier(index, 'endingUnit', Number(e.target.value))}
                                className="auth-input w-full text-sm"
                                min="1"
                              />
                            </div>
                            <div>
                              <label htmlFor={`tier-${index}-pricePerUnit`} className="block text-xs auth-text-muted mb-1">
                                Price per Unit ({getCurrencySymbol(formData.currency)})
                              </label>
                              <input
                                id={`tier-${index}-pricePerUnit`}
                                type="number"
                                value={tier.pricePerUnit}
                                onChange={(e) => updateTier(index, 'pricePerUnit', Number(e.target.value))}
                                className="auth-input w-full text-sm"
                                min="0"
                                step="0.001"
                              />
                            </div>
                          </div>
                          {formData.tiers.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeTier(index)}
                              className="btn-secondary text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      
                      <button className="btn-secondary">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Tier
                      </button>
                    </div>
                  </div>
                )}

                {/* Percentage Configuration */}
                {formData.chargeModel === 'percentage' && (
                  <div className="glass-card p-6">
                    <h4 className="text-lg font-medium auth-text mb-4">Percentage Configuration</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="percentageOf" className="block text-sm font-normal tracking-tight auth-text mb-2">
                          Percentage of *
                        </label>
                        <input
                          id="percentageOf"
                          type="text"
                          value={formData.percentageOf}
                          onChange={(e) => setFormData({ ...formData, percentageOf: e.target.value })}
                          className="auth-input w-full"
                          placeholder="Plan amount, total invoice, etc."
                        />
                      </div>
                      <div>
                        <label htmlFor="percentageValue" className="block text-sm font-normal tracking-tight auth-text mb-2">
                          Percentage Value (%) *
                        </label>
                        <input
                          id="percentageValue"
                          type="number"
                          value={formData.percentageValue}
                          onChange={(e) => setFormData({ ...formData, percentageValue: Number(e.target.value) })}
                          className="auth-input w-full"
                          min="0"
                          max="100"
                          step="0.01"
                          placeholder="5.00"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Limits */}
                <div className="glass-card p-6">
                  <h4 className="text-lg font-medium auth-text mb-4">Charge Limits</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="minimumCharge" className="block text-sm font-normal tracking-tight auth-text mb-2">
                        Minimum Charge ({getCurrencySymbol(formData.currency)})
                      </label>
                      <input
                        id="minimumCharge"
                        type="number"
                        value={formData.minimumCharge ?? ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          minimumCharge: e.target.value ? Number(e.target.value) : undefined
                        })}
                        className="auth-input w-full"
                        min="0"
                        step="0.01"
                        placeholder="Leave empty for no minimum"
                      />
                    </div>
                    <div>
                      <label htmlFor="maximumCharge" className="block text-sm font-normal tracking-tight auth-text mb-2">
                        Maximum Charge ({getCurrencySymbol(formData.currency)})
                      </label>
                      <input
                        id="maximumCharge"
                        type="number"
                        value={formData.maximumCharge ?? ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          maximumCharge: e.target.value ? Number(e.target.value) : undefined
                        })}
                        className="auth-input w-full"
                        min="0"
                        step="0.01"
                        placeholder="Leave empty for no maximum"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h3 className="text-xl font-medium tracking-tight auth-text mb-4">Advanced Configuration</h3>
                
                {/* Tax Configuration */}
                <div className="glass-card p-6">
                  <h4 className="text-lg font-medium auth-text mb-4">Tax Configuration</h4>
                  
                  <div className="space-y-4">
                    <label className="flex items-center space-x-3" aria-label="This charge is taxable">
                      <input
                        type="checkbox"
                        checked={formData.taxable}
                        onChange={(e) => setFormData({ ...formData, taxable: e.target.checked })}
                        className="auth-checkbox"
                      />
                      <span className="text-sm font-normal tracking-tight auth-text">This charge is taxable</span>
                    </label>

                    {formData.taxable && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                        <label className="flex items-center space-x-3" aria-label="Tax inclusive">
                          <input
                            type="checkbox"
                            checked={formData.taxConfiguration.taxInclusive}
                            onChange={(e) => setFormData({
                              ...formData,
                              taxConfiguration: {
                                ...formData.taxConfiguration,
                                taxInclusive: e.target.checked
                              }
                            })}
                            className="auth-checkbox"
                          />
                          <span className="text-sm auth-text">Tax inclusive</span>
                        </label>

                        <div>
                          <label htmlFor="taxCode" className="block text-sm font-normal tracking-tight auth-text mb-2">
                            Tax Code
                          </label>
                          <input
                            id="taxCode"
                            type="text"
                            value={formData.taxConfiguration.taxCode}
                            onChange={(e) => setFormData({
                              ...formData,
                              taxConfiguration: {
                                ...formData.taxConfiguration,
                                taxCode: e.target.value
                              }
                            })}
                            className="auth-input w-full"
                            placeholder="VAT, GST, etc."
                          />
                        </div>

                        <div>
                          <label htmlFor="exemptionCode" className="block text-sm font-normal tracking-tight auth-text mb-2">
                            Exemption Code
                          </label>
                          <input
                            id="exemptionCode"
                            type="text"
                            value={formData.taxConfiguration.exemptionCode}
                            onChange={(e) => setFormData({
                              ...formData,
                              taxConfiguration: {
                                ...formData.taxConfiguration,
                                exemptionCode: e.target.value
                              }
                            })}
                            className="auth-input w-full"
                            placeholder="EX001, etc."
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Geographic Restrictions */}
                <div className="glass-card p-6">
                  <h4 className="text-lg font-medium auth-text mb-4">Geographic Restrictions</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Applicable Countries */}
                    <div>
                      <label htmlFor="applicable-countries" className="block text-sm font-normal tracking-tight auth-text mb-2">
                        Applicable Countries
                      </label>
                      <div className="flex space-x-2 mb-3">
                        <input
                          id="applicable-countries"
                          type="text"
                          value={customCountry}
                          onChange={(e) => setCustomCountry(e.target.value)}
                          className="auth-input flex-1"
                          placeholder="Enter country code (US, CA, GB)"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              addCountry('applicable')
                            }
                          }}
                        />
                        <button
                          type="button" 
                          onClick={() => addCountry('applicable')}
                          className="btn-primary"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {formData.applicableCountries.map((country, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded text-sm">
                            <span className="auth-text">{country}</span>
                            <button
                              type="button"
                              onClick={() => removeCountry(country, 'applicable')}
                              className="btn-secondary text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        {formData.applicableCountries.length === 0 && (
                          <p className="text-center py-4 auth-text-muted text-sm">All countries (no restrictions)</p>
                        )}
                      </div>
                    </div>

                    {/* Excluded Countries */}
                    <div>
                      <label htmlFor="excluded-countries" className="block text-sm font-normal tracking-tight auth-text mb-2">
                        Excluded Countries
                      </label>
                      <div className="flex space-x-2 mb-3">
                        <input
                          id="excluded-countries"
                          type="text"
                          value={customCountry}
                          onChange={(e) => setCustomCountry(e.target.value)}
                          className="auth-input flex-1"
                          placeholder="Enter country code (RU, CN, IR)"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              addCountry('excluded')
                            }
                          }}
                        />
                        <button
                          type="button" 
                          onClick={() => addCountry('excluded')}
                          className="btn-secondary"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {formData.excludedCountries.map((country, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-red-500/10 rounded text-sm">
                            <span className="text-red-400">{country}</span>
                            <button
                              type="button"
                              onClick={() => removeCountry(country, 'excluded')}
                              className="btn-secondary text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        {formData.excludedCountries.length === 0 && (
                          <p className="text-center py-4 auth-text-muted text-sm">No excluded countries</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Accounting Configuration */}
                <div className="glass-card p-6">
                  <h4 className="text-lg font-medium auth-text mb-4">Accounting Integration</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label htmlFor="revenue-account" className="block text-sm font-normal tracking-tight auth-text mb-2">
                        Revenue Account
                      </label>
                      <input
                        id="revenue-account"
                        type="text"
                        value={formData.accounting.revenueAccount}
                        onChange={(e) => setFormData({
                          ...formData,
                          accounting: {
                            ...formData.accounting,
                            revenueAccount: e.target.value
                          }
                        })}
                        className="auth-input w-full"
                        placeholder="4000"
                      />
                    </div>
                    <div>
                      <label htmlFor="deferred-revenue-account" className="block text-sm font-normal tracking-tight auth-text mb-2">
                        Deferred Revenue Account
                      </label>
                      <input
                        id="deferred-revenue-account"
                        type="text"
                        value={formData.accounting.deferredRevenueAccount}
                        onChange={(e) => setFormData({
                          ...formData,
                          accounting: {
                            ...formData.accounting,
                            deferredRevenueAccount: e.target.value
                          }
                        })}
                        className="auth-input w-full"
                        placeholder="2400"
                      />
                    </div>
                    <div>
                      <label htmlFor="cost-center" className="block text-sm font-normal tracking-tight auth-text mb-2">
                        Cost Center
                      </label>
                      <input
                        id="cost-center"
                        type="text"
                        value={formData.accounting.costCenter}
                        onChange={(e) => setFormData({
                          ...formData,
                          accounting: {
                            ...formData.accounting,
                            costCenter: e.target.value
                          }
                        })}
                        className="auth-input w-full"
                        placeholder="CC001"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <h3 className="text-xl font-medium tracking-tight auth-text mb-4">Review Charge Configuration</h3>
                
                {/* Basic Info Summary */}
                <div className="glass-card p-6">
                  <h4 className="text-lg font-medium auth-text mb-4">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm auth-text-muted">Name:</span>
                      <p className="font-medium auth-text">{formData.name || 'Untitled Charge'}</p>
                    </div>
                    <div>
                      <span className="text-sm auth-text-muted">Type:</span>
                      <p className="font-medium auth-text">
                        {chargeTypes.find(t => t.value === formData.chargeType)?.label}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm auth-text-muted">Model:</span>
                      <p className="font-medium auth-text">
                        {chargeModels.find(m => m.value === formData.chargeModel)?.label}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm auth-text-muted">Currency:</span>
                      <p className="font-medium auth-text">{formData.currency}</p>
                    </div>
                  </div>
                </div>

                {/* Pricing Summary */}
                <div className="glass-card p-6">
                  <h4 className="text-lg font-medium auth-text mb-4">Pricing Details</h4>
                  {formData.chargeModel === 'flat_fee' && (
                    <p className="auth-text">
                      Fixed amount: <span className="font-medium">
                        {getCurrencySymbol(formData.currency)}{formData.amount}
                      </span>
                    </p>
                  )}
                  {formData.chargeModel === 'per_unit' && (
                    <div className="space-y-2">
                      <p className="auth-text">
                        Unit: <span className="font-medium">{formData.unitName}</span>
                      </p>
                      <p className="auth-text">
                        Price per unit: <span className="font-medium">
                          {getCurrencySymbol(formData.currency)}{formData.unitPrice}
                        </span>
                      </p>
                      {formData.freeUnits > 0 && (
                        <p className="auth-text">
                          Free units: <span className="font-medium">{formData.freeUnits}</span>
                        </p>
                      )}
                    </div>
                  )}
                  {formData.chargeModel === 'tiered' && (
                    <div className="space-y-2">
                      <p className="auth-text">
                        Unit: <span className="font-medium">{formData.unitName}</span>
                      </p>
                      <div className="space-y-1">
                        {formData.tiers.map((tier, index) => (
                          <div key={index} className="text-sm auth-text p-2 bg-white/5 rounded">
                            {tier.startingUnit}-{tier.endingUnit} units: {getCurrencySymbol(formData.currency)}{tier.pricePerUnit} each
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {formData.chargeModel === 'percentage' && (
                    <div className="space-y-2">
                      <p className="auth-text">
                        Percentage of: <span className="font-medium">{formData.percentageOf}</span>
                      </p>
                      <p className="auth-text">
                        Rate: <span className="font-medium">{formData.percentageValue}%</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Configuration Summary */}
                <div className="glass-card p-6">
                  <h4 className="text-lg font-medium auth-text mb-4">Configuration</h4>
                  <div className="space-y-3">
                    {formData.taxable && (
                      <div className="flex items-center p-2 bg-blue-500/20 rounded">
                        <DollarSign className="w-4 h-4 text-blue-400 mr-2" />
                        <span className="text-sm text-blue-400">Taxable charge</span>
                      </div>
                    )}
                    {formData.isProrated && (
                      <div className="flex items-center p-2 bg-green-500/20 rounded">
                        <Calendar className="w-4 h-4 text-green-400 mr-2" />
                        <span className="text-sm text-green-400">Prorated billing enabled</span>
                      </div>
                    )}
                    {formData.applicableCountries.length > 0 && (
                      <div className="flex items-center p-2 bg-purple-500/20 rounded">
                        <Globe className="w-4 h-4 text-purple-400 mr-2" />
                        <span className="text-sm text-purple-400">
                          Restricted to: {formData.applicableCountries.join(', ')}
                        </span>
                      </div>
                    )}
                    {formData.excludedCountries.length > 0 && (
                      <div className="flex items-center p-2 bg-red-500/20 rounded">
                        <Globe className="w-4 h-4 text-red-400 mr-2" />
                        <span className="text-sm text-red-400">
                          Excluded from: {formData.excludedCountries.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-white/10">
            <div>
              {step > 1 && (
                <button className="btn-secondary">
                  Previous
                </button>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="btn-secondary">
                Cancel
              </button>
              {step < steps.length ? (
                <button className="btn-primary">
                  Next
                </button>
              ) : (
                <button className="btn-primary">
                  {existingCharge ? 'Update Charge' : 'Create Charge'}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
