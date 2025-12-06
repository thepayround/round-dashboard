import { motion } from 'framer-motion'
import { Package, Plus } from 'lucide-react'

import type { StepComponentProps } from '../../config/types'
import { useProductsStepController } from '../../hooks/useProductsStepController'
import type { ProductInfo } from '../../types/onboarding'

import { DetailCard } from '@/shared/ui/DetailCard'
import { Button } from '@/shared/ui/shadcn/button'

type ProductsStepProps = StepComponentProps<ProductInfo>

export const ProductsStep = ({ data, onChange }: ProductsStepProps) => {
  const { products, hasProducts, handleAddProduct } = useProductsStepController({ data, onChange })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1 text-center">
        <h2 className="text-base font-medium text-foreground">Products</h2>
        <p className="text-sm text-muted-foreground">Set up your product catalog</p>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        <DetailCard
          title="Product Catalog"
          icon={<Package className="h-4 w-4" />}
        >
          <div className="space-y-6">
            {/* Empty State / Add Product */}
            {!hasProducts ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 mx-auto rounded-lg bg-muted flex items-center justify-center mb-4">
                  <Package className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="text-sm font-medium text-foreground mb-2">Add Your First Product</h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
                  Create your first product to start managing your catalog and pricing.
                </p>
                <Button
                  type="button"
                  onClick={handleAddProduct}
                  variant="default"
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Product
                </Button>
              </div>
            ) : (
              <>
                {/* Products List */}
                <div className="space-y-3">
                  {products.map(product => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          <Package className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-foreground">{product.name}</h5>
                          <p className="text-xs text-muted-foreground">{product.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">${product.price}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <Button
                  type="button"
                  onClick={handleAddProduct}
                  variant="secondary"
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Another Product
                </Button>
              </>
            )}

            <p className="text-xs text-muted-foreground text-center pt-2">
              You can always add products later in your dashboard
            </p>
          </div>
        </DetailCard>
      </div>
    </div>
  )
}
