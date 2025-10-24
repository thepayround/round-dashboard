import { useState } from 'react'
import { motion } from 'framer-motion'
import { UiDropdown } from '@/shared/components/ui/UiDropdown'
import type { UiDropdownOption } from '@/shared/components/ui/UiDropdown'
import { 
  Plus, 
  Trash2, 
  DollarSign, 
  TrendingUp, 
  BarChart3, 
  Layers,
  Package,
  Percent,
  Calculator,
  Info
} from 'lucide-react'
import type { PricingModel, PricingTier, MeteredUsage } from '../types/catalog.types'

interface PricingModelBuilderProps {
  pricingModel: PricingModel
  price: number
  tiers?: PricingTier[]
  meteredUsage?: MeteredUsage[]
  packageSize?: number
  freeQuantity?: number
  onPricingModelChange: (model: PricingModel) => void
  onPriceChange: (price: number) => void
  onTiersChange: (tiers: PricingTier[]) => void
  onMeteredUsageChange?: (usage: MeteredUsage[]) => void
  onPackageSizeChange?: (size: number) => void
  onFreeQuantityChange?: (quantity: number) => void
}

const pricingModelOptions = [
  {
    id: 'flat_fee' as PricingModel,
    name: 'Flat Fee',
    description: 'Fixed recurring charge with no quantity',
    icon: DollarSign,
    example: '$29/month - Simple fixed pricing'
  },
  {
    id: 'per_unit' as PricingModel,
    name: 'Per Unit',
    description: 'Price per unit quantity',
    icon: Calculator,
    example: '$5 per user/month'
  },
  {
    id: 'tiered' as PricingModel,
    name: 'Tiered',
    description: 'Different prices for quantity ranges',
    icon: Layers,
    example: '1-10 users: $5/user, 11-50: $4/user'
  },
  {
    id: 'volume' as PricingModel,
    name: 'Volume',
    description: 'Single price based on total quantity',
    icon: BarChart3,
    example: '1-10: $5/user for all, 11-50: $4/user for all'
  },
  {
    id: 'stairstep' as PricingModel,
    name: 'Stairstep',
    description: 'Flat fee for quantity tiers',
    icon: TrendingUp,
    example: '1-10 users: $50, 11-50 users: $150'
  },
  {
    id: 'package' as PricingModel,
    name: 'Package',
    description: 'Price per block of units',
    icon: Package,
    example: '$10 per 100 API calls'
  },
  {
    id: 'percentage' as PricingModel,
    name: 'Percentage',
    description: 'Percentage of transaction value',
    icon: Percent,
    example: '2.9% of transaction amount'
  },
  {
    id: 'metered' as PricingModel,
    name: 'Metered',
    description: 'Usage-based billing with real-time tracking',
    icon: TrendingUp,
    example: '$0.10 per API call with 1000 included'
  }
]

const aggregationOptions: UiDropdownOption[] = [
  { value: 'sum', label: 'Sum', description: 'Add all values together' },
  { value: 'max', label: 'Maximum', description: 'Use the highest value' },
  { value: 'last_value', label: 'Last Value', description: 'Use the most recent value' },
  { value: 'unique_count', label: 'Unique Count', description: 'Count distinct values' }
]

export const PricingModelBuilder = ({
  pricingModel,
  price,
  tiers = [],
  meteredUsage = [],
  packageSize = 1,
  freeQuantity = 0,
  onPricingModelChange,
  onPriceChange,
  onTiersChange,
  onMeteredUsageChange,
  onPackageSizeChange,
  onFreeQuantityChange
}: PricingModelBuilderProps) => {
  const [selectedModel, setSelectedModel] = useState(pricingModel)

  const handleModelChange = (model: PricingModel) => {
    setSelectedModel(model)
    onPricingModelChange(model)
  }

  const _addTier = () => {
    const newTier: PricingTier = {
      startingUnit: tiers.length > 0 ? (tiers[tiers.length - 1].endingUnit ?? 0) + 1 : 1,
      endingUnit: undefined,
      price: 0
    }
    onTiersChange([...tiers, newTier])
  }

  const updateTier = (index: number, updatedTier: PricingTier) => {
    const newTiers = [...tiers]
    newTiers[index] = updatedTier
    onTiersChange(newTiers)
  }

  const removeTier = (index: number) => {
    onTiersChange(tiers.filter((_, i) => i !== index))
  }

  const _addMeteredUsage = () => {
    const newUsage: MeteredUsage = {
      metricId: '',
      metricName: '',
      unit: '',
      aggregation: 'sum',
      pricePerUnit: 0,
      includedQuantity: 0,
      overage: true
    }
    onMeteredUsageChange?.([...meteredUsage, newUsage])
  }

  const updateMeteredUsage = (index: number, updatedUsage: MeteredUsage) => {
    const newUsage = [...meteredUsage]
    newUsage[index] = updatedUsage
    onMeteredUsageChange?.(newUsage)
  }

  const removeMeteredUsage = (index: number) => {
    onMeteredUsageChange?.(meteredUsage.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      {/* Pricing Model Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium tracking-tight auth-text">Pricing Model</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {pricingModelOptions.map(option => (
            <motion.button
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleModelChange(option.id)}
              className={`p-4 rounded-lg border text-left transition-all ${
                selectedModel === option.id
                  ? 'border-[#D417C8] bg-[#D417C8]/10 text-white'
                  : 'border-[#25262a] bg-[#171719] text-white/70 hover:text-white hover:border-[#2c2d31]'
              }`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <option.icon className="w-5 h-5" />
                <span className="font-medium">{option.name}</span>
              </div>
              <p className="text-sm opacity-70 mb-2">{option.description}</p>
              <div className="flex items-center space-x-1 text-xs opacity-60">
                <Info className="w-3 h-3" />
                <span>{option.example}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Base Price Configuration */}
      {(selectedModel === 'flat_fee' || selectedModel === 'per_unit' || selectedModel === 'percentage') && (
        <div className="glass-card p-6">
          <h4 className="text-lg font-medium auth-text mb-4">Price Configuration</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="pricing-base-price" className="block text-sm font-normal tracking-tight auth-text mb-2">
                {selectedModel === 'percentage' ? 'Percentage (%)' : 'Price ($)'}
              </label>
              <input
                id="pricing-base-price"
                type="number"
                value={price}
                onChange={(e) => onPriceChange(Number(e.target.value))}
                step={selectedModel === 'percentage' ? '0.01' : '0.01'}
                min="0"
                className="auth-input w-full"
                placeholder={selectedModel === 'percentage' ? '2.90' : '29.00'}
              />
            </div>
            
            {selectedModel === 'per_unit' && (
              <div>
                <label htmlFor="pricing-free-quantity" className="block text-sm font-normal tracking-tight auth-text mb-2">
                  Free Quantity
                </label>
                <input
                  id="pricing-free-quantity"
                  type="number"
                  value={freeQuantity}
                  onChange={(e) => onFreeQuantityChange?.(Number(e.target.value))}
                  min="0"
                  className="auth-input w-full"
                  placeholder="0"
                />
                <p className="text-xs auth-text-muted mt-1">
                  Number of units included at no extra charge
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Package Size Configuration */}
      {selectedModel === 'package' && (
        <div className="glass-card p-6">
          <h4 className="text-lg font-medium auth-text mb-4">Package Configuration</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="package-price" className="block text-sm font-normal tracking-tight auth-text mb-2">
                Price per Package ($)
              </label>
              <input
                id="package-price"
                type="number"
                value={price}
                onChange={(e) => onPriceChange(Number(e.target.value))}
                step="0.01"
                min="0"
                className="auth-input w-full"
                placeholder="10.00"
              />
            </div>
            <div>
              <label htmlFor="package-size" className="block text-sm font-normal tracking-tight auth-text mb-2">
                Package Size
              </label>
              <input
                id="package-size"
                type="number"
                value={packageSize}
                onChange={(e) => onPackageSizeChange?.(Number(e.target.value))}
                min="1"
                className="auth-input w-full"
                placeholder="100"
              />
              <p className="text-xs auth-text-muted mt-1">
                Number of units per package
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tiered Pricing Configuration */}
      {(selectedModel === 'tiered' || selectedModel === 'volume' || selectedModel === 'stairstep') && (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium auth-text">Pricing Tiers</h4>
            <button className="btn-secondary">
              <Plus className="w-4 h-4" />
              <span>Add Tier</span>
            </button>
          </div>
          
          <div className="space-y-4">
            {tiers.map((tier, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-[#171719] rounded-lg border border-[#25262a]"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-normal tracking-tight auth-text">Tier {index + 1}</span>
                  <button
                    onClick={() => removeTier(index)}
                    className="btn-secondary text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor={`starting-unit-${index}`} className="block text-sm font-normal tracking-tight auth-text mb-2">
                      Starting Unit
                    </label>
                    <input
                      id={`starting-unit-${index}`}
                      type="number"
                      value={tier.startingUnit}
                      onChange={(e) => updateTier(index, { ...tier, startingUnit: Number(e.target.value) })}
                      min="1"
                      className="auth-input w-full"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor={`ending-unit-${index}`} className="block text-sm font-normal tracking-tight auth-text mb-2">
                      Ending Unit
                    </label>
                    <input
                      id={`ending-unit-${index}`}
                      type="number"
                      value={tier.endingUnit ?? ''}
                      onChange={(e) => updateTier(index, { 
                        ...tier, 
                        endingUnit: e.target.value ? Number(e.target.value) : undefined 
                      })}
                      className="auth-input w-full"
                      placeholder="Unlimited"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor={`tier-price-${index}`} className="block text-sm font-normal tracking-tight auth-text mb-2">
                      {selectedModel === 'stairstep' ? 'Flat Fee ($)' : 'Price per Unit ($)'}
                    </label>
                    <input
                      id={`tier-price-${index}`}
                      type="number"
                      value={tier.price}
                      onChange={(e) => updateTier(index, { ...tier, price: Number(e.target.value) })}
                      step="0.01"
                      min="0"
                      className="auth-input w-full"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
            
            {tiers.length === 0 && (
              <div className="text-center py-8 auth-text-muted">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No pricing tiers defined. Add your first tier to get started.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Metered Usage Configuration */}
      {selectedModel === 'metered' && (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium auth-text">Metered Usage</h4>
            <button className="btn-secondary">
              <Plus className="w-4 h-4" />
              <span>Add Metric</span>
            </button>
          </div>
          
          <div className="space-y-4">
            {meteredUsage.map((usage, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-[#171719] rounded-lg border border-[#25262a]"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-normal tracking-tight auth-text">Metric {index + 1}</span>
                  <button
                    onClick={() => removeMeteredUsage(index)}
                    className="btn-secondary text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor={`metric-name-${index}`} className="block text-sm font-normal tracking-tight auth-text mb-2">
                      Metric Name
                    </label>
                    <input
                      id={`metric-name-${index}`}
                      type="text"
                      value={usage.metricName}
                      onChange={(e) => updateMeteredUsage(index, { ...usage, metricName: e.target.value })}
                      className="auth-input w-full"
                      placeholder="API Calls"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor={`metric-unit-${index}`} className="block text-sm font-normal tracking-tight auth-text mb-2">
                      Unit
                    </label>
                    <input
                      id={`metric-unit-${index}`}
                      type="text"
                      value={usage.unit}
                      onChange={(e) => updateMeteredUsage(index, { ...usage, unit: e.target.value })}
                      className="auth-input w-full"
                      placeholder="call"
                    />
                  </div>
                  
                  <div>
                    <div className="block text-sm font-normal tracking-tight auth-text mb-2">
                      Aggregation
                    </div>
                    <UiDropdown
                      options={aggregationOptions}
                      value={usage.aggregation}
                      onSelect={(value) => updateMeteredUsage(index, {
                        ...usage,
                        aggregation: value as 'sum' | 'max' | 'last_value' | 'unique_count'
                      })}
                      placeholder="Select aggregation method"
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor={`metric-price-${index}`} className="block text-sm font-normal tracking-tight auth-text mb-2">
                      Price per Unit ($)
                    </label>
                    <input
                      id={`metric-price-${index}`}
                      type="number"
                      value={usage.pricePerUnit}
                      onChange={(e) => updateMeteredUsage(index, { ...usage, pricePerUnit: Number(e.target.value) })}
                      step="0.001"
                      min="0"
                      className="auth-input w-full"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor={`metric-included-${index}`} className="block text-sm font-normal tracking-tight auth-text mb-2">
                      Included Quantity
                    </label>
                    <input
                      id={`metric-included-${index}`}
                      type="number"
                      value={usage.includedQuantity ?? 0}
                      onChange={(e) => updateMeteredUsage(index, { 
                        ...usage, 
                        includedQuantity: Number(e.target.value) 
                      })}
                      min="0"
                      className="auth-input w-full"
                    />
                  </div>
                  
                  <div className="flex items-center pt-6">
                    <label className="flex items-center space-x-2" aria-label="Allow overage charges beyond included quantity">
                      <input
                        type="checkbox"
                        checked={usage.overage}
                        onChange={(e) => updateMeteredUsage(index, { ...usage, overage: e.target.checked })}
                        className="auth-checkbox"
                      />
                      <span className="text-sm auth-text">Allow Overage</span>
                    </label>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {meteredUsage.length === 0 && (
              <div className="text-center py-8 auth-text-muted">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No usage metrics defined. Add your first metric to get started.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
