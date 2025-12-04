import { motion } from 'framer-motion'
import { Package } from 'lucide-react'

import type { StepComponentProps } from '../../config/types'
import { useProductsStepController } from '../../hooks/useProductsStepController'
import type { ProductInfo } from '../../types/onboarding'

import { Button } from '@/shared/ui/shadcn/button'

type ProductsStepProps = StepComponentProps<ProductInfo>

export const ProductsStep = ({ data, onChange }: ProductsStepProps) => {
  const { products, hasProducts, handleAddProduct } = useProductsStepController({ data, onChange })

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
          className="w-16 h-16 mx-auto rounded-lg bg-secondary/20 border border-secondary/20 flex items-center justify-center"
        >
          <Package className="w-8 h-8 text-secondary" />
        </motion.div>

        <div>
          <h2 className="text-lg font-medium tracking-tight text-white mb-2">Products</h2>
          <p className="text-gray-400 text-sm">Set up your product catalog</p>
        </div>
      </div>

      {/* Add Product Section */}
      <div className="space-y-6">
        <div className="text-center space-y-6">
          <div className="p-8">
            <div className="space-y-4">
              <div className="w-12 h-12 mx-auto rounded-lg bg-secondary/20 border border-secondary/20 flex items-center justify-center">
                <Package className="w-6 h-6 text-secondary" />
              </div>

              <div>
                <h3 className="font-medium text-white mb-2 tracking-tight">Add Your First Product</h3>
                <p className="text-gray-400">
                  Create your first product to start managing your catalog and pricing.
                </p>
              </div>

              <Button
                onClick={handleAddProduct}
                variant="default"
              >
                Add Product
              </Button>
            </div>
          </div>
        </div>

        {/* Products List (if any) */}
        {hasProducts && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-medium text-white">Your Products</h4>
            <div className="space-y-4">
              {products.map(product => (
                <div
                  key={product.id}
                  className="p-4 rounded-lg bg-muted border border-border"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-white">{product.name}</h5>
                      <p className="text-gray-500 dark:text-polar-500 leading-snug">{product.description}</p>
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
          <p className="text-gray-400">
            You can always add products later in your dashboard
          </p>
        </div>
      </div>
    </motion.div>
  )
}
