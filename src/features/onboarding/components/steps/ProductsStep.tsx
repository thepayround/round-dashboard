import { motion } from 'framer-motion'
import { Package } from 'lucide-react'

import type { ProductInfo } from '../../types/onboarding'
import { ActionButton } from '@/shared/components'

interface ProductsStepProps {
  data: ProductInfo
  onChange: (data: ProductInfo) => void
}

export const ProductsStep = ({ data, onChange }: ProductsStepProps) => {
  const handleAddProduct = () => {
    // This would typically open a modal or navigate to a product creation form
    onChange({
      ...data,
      hasProducts: true,
      products: [
        ...data.products,
        {
          id: Date.now().toString(),
          name: 'Sample Product',
          description: 'Description for your first product',
          price: 0,
        },
      ],
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
          className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#14BDEA]/20 to-[#32A1E4]/20 backdrop-blur-sm border border-white/20 flex items-center justify-center"
        >
          <Package className="w-8 h-8 text-[#14BDEA]" />
        </motion.div>

        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Products</h2>
          <p className="text-gray-400 text-lg">Set up your product catalog</p>
        </div>
      </div>

      {/* Add Product Section */}
      <div className="space-y-6">
        <div className="text-center space-y-6">
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
            <div className="space-y-4">
              <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-[#14BDEA]/20 to-[#32A1E4]/20 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <Package className="w-6 h-6 text-[#14BDEA]" />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Add Your First Product</h3>
                <p className="text-gray-400">
                  Create your first product to start managing your catalog and pricing.
                </p>
              </div>

              <ActionButton
                label="Add Product"
                onClick={handleAddProduct}
                size="md"
                variant="primary"
                animated={false}
              />
            </div>
          </div>
        </div>

        {/* Products List (if any) */}
        {data.products.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-medium text-white">Your Products</h4>
            <div className="space-y-3">
              {data.products.map(product => (
                <div
                  key={product.id}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-white">{product.name}</h5>
                      <p className="text-sm text-gray-400">{product.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-white">${product.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Skip Option */}
        <div className="text-center">
          <p className="text-sm text-gray-400">
            You can always add products later in your dashboard
          </p>
        </div>
      </div>
    </motion.div>
  )
}
