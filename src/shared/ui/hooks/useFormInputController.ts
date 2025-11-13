import { useCallback, useId, useMemo, useState } from 'react'
import type { FocusEvent } from 'react'

interface UseFormInputControllerOptions {
  id?: string
  type?: string
  error?: string
  helpText?: string
  onFocus?: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBlur?: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onRightIconClick?: () => void
  enablePasswordToggle?: boolean
}

interface UseFormInputControllerReturn {
  inputId: string
  errorId?: string
  helpTextId?: string
  hasError: boolean
  isFocused: boolean
  isHovered: boolean
  resolvedType: string
  shouldShowPasswordToggle: boolean
  isPasswordVisible: boolean
  rightIconAriaLabel?: string
  handleFocus: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleBlur: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleMouseEnter: () => void
  handleMouseLeave: () => void
  handleRightIconClick: () => void
}

export const useFormInputController = ({
  id,
  type = 'text',
  error,
  helpText,
  onFocus,
  onBlur,
  onRightIconClick,
  enablePasswordToggle = false,
}: UseFormInputControllerOptions): UseFormInputControllerReturn => {
  const generatedId = useId()
  const inputId = useMemo(() => id ?? `input-${generatedId.replace(/:/g, '')}`, [generatedId, id])
  const [isFocused, setIsFocused] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const hasError = Boolean(error)
  const errorId = hasError ? `${inputId}-error` : undefined
  const helpTextId = helpText ? `${inputId}-help` : undefined
  const shouldShowPasswordToggle = enablePasswordToggle && type === 'password'

  const resolvedType = shouldShowPasswordToggle && isPasswordVisible ? 'text' : type

  const handleFocus = useCallback(
    (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setIsFocused(true)
      onFocus?.(event)
    },
    [onFocus]
  )

  const handleBlur = useCallback(
    (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setIsFocused(false)
      onBlur?.(event)
    },
    [onBlur]
  )

  const handleRightIconClick = useCallback(() => {
    if (shouldShowPasswordToggle) {
      setIsPasswordVisible(prev => !prev)
      return
    }
    onRightIconClick?.()
  }, [onRightIconClick, shouldShowPasswordToggle])

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
  }, [])

  const rightIconAriaLabel = shouldShowPasswordToggle
    ? isPasswordVisible
      ? 'Hide password'
      : 'Show password'
    : undefined

  return {
    inputId,
    errorId,
    helpTextId,
    hasError,
    isFocused,
    isHovered,
    resolvedType,
    shouldShowPasswordToggle,
    isPasswordVisible,
    rightIconAriaLabel,
    handleFocus,
    handleBlur,
    handleMouseEnter,
    handleMouseLeave,
    handleRightIconClick,
  }
}
