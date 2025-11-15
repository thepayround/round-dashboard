import { useCallback, useId, useMemo, useState } from 'react'
import type { FocusEvent } from 'react'

interface UseTextareaControllerOptions {
  id?: string
  error?: string
  helpText?: string
  onFocus?: (event: FocusEvent<HTMLTextAreaElement>) => void
  onBlur?: (event: FocusEvent<HTMLTextAreaElement>) => void
}

interface UseTextareaControllerReturn {
  textareaId: string
  errorId?: string
  helpTextId?: string
  hasError: boolean
  isFocused: boolean
  isHovered: boolean
  handleFocus: (event: FocusEvent<HTMLTextAreaElement>) => void
  handleBlur: (event: FocusEvent<HTMLTextAreaElement>) => void
  handleMouseEnter: () => void
  handleMouseLeave: () => void
  ariaProps: {
    'aria-invalid'?: boolean
    'aria-describedby'?: string
  }
}

export const useTextareaController = ({
  id,
  error,
  helpText,
  onFocus,
  onBlur,
}: UseTextareaControllerOptions): UseTextareaControllerReturn => {
  const generatedId = useId()
  const textareaId = useMemo(
    () => id ?? `textarea-${generatedId.replace(/:/g, '')}`,
    [generatedId, id]
  )
  const [isFocused, setIsFocused] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const hasError = Boolean(error)
  const errorId = hasError ? `${textareaId}-error` : undefined
  const helpTextId = helpText ? `${textareaId}-help` : undefined

  const handleFocus = useCallback(
    (event: FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true)
      onFocus?.(event)
    },
    [onFocus]
  )

  const handleBlur = useCallback(
    (event: FocusEvent<HTMLTextAreaElement>) => {
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
    textareaId,
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
