import { useCallback } from 'react'

import type { ProductInfo } from '../types/onboarding'

interface UseProductsStepControllerParams {
  data: ProductInfo
  onChange: (data: ProductInfo) => void
}

interface UseProductsStepControllerReturn {
  products: ProductInfo['products']
  hasProducts: boolean
  handleAddProduct: () => void
}

export const useProductsStepController = ({
  data,
  onChange,
}: UseProductsStepControllerParams): UseProductsStepControllerReturn => {
  const handleAddProduct = useCallback(() => {
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
  }, [data, onChange])

  return {
    products: data.products,
    hasProducts: data.products.length > 0,
    handleAddProduct,
  }
}
