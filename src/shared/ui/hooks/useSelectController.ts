import { useCallback, useId, useMemo, useState } from 'react'
import type { FocusEvent } from 'react'

interface UseSelectControllerOptions {
  id?: string
  error?: string
  helpText?: string
  onFocus?: (event: FocusEvent<HTMLSelectElement>) => void
  onBlur?: (event: FocusEvent<HTMLSelectElement>) => void
}

interface UseSelectControllerReturn {
  selectId: string
  errorId?: string
  helpTextId?: string
  hasError: boolean
  isFocused: boolean
  isHovered: boolean
  handleFocus: (event: FocusEvent<HTMLSelectElement>) => void
  handleBlur: (event: FocusEvent<HTMLSelectElement>) => void
  handleMouseEnter: () => void
  handleMouseLeave: () => void
  ariaProps: {
    'aria-invalid'?: boolean
    'aria-describedby'?: string
  }
}

export const useSelectController = ({
  id,
  error,
  helpText,
  onFocus,
  onBlur,
}: UseSelectControllerOptions): UseSelectControllerReturn => {
  const generatedId = useId()
  const selectId = useMemo(() => id ?? `select-${generatedId.replace(/:/g, '')}`, [generatedId, id])
  const [isFocused, setIsFocused] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const hasError = Boolean(error)
  const errorId = hasError ? `${selectId}-error` : undefined
  const helpTextId = helpText ? `${selectId}-help` : undefined

  const handleFocus = useCallback(
    (event: FocusEvent<HTMLSelectElement>) => {
      setIsFocused(true)
      onFocus?.(event)
    },
    [onFocus]
  )

  const handleBlur = useCallback(
    (event: FocusEvent<HTMLSelectElement>) => {
      setIsFocused(false)
      onBlur?.(event)
    },
    [onBlur]
  )

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
  }, [])

  // Compute aria-describedby based on error and help text
  const ariaDescribedBy = [errorId, helpTextId].filter(Boolean).join(' ') || undefined

  return {
    selectId,
    errorId,
    helpTextId,
    hasError,
    isFocused,
    isHovered,
    handleFocus,
    handleBlur,
    handleMouseEnter,
    handleMouseLeave,
    ariaProps: {
      'aria-invalid': hasError ? true : undefined,
      'aria-describedby': ariaDescribedBy,
    },
  }
}
