import { useCallback, useMemo, useState } from 'react'
import type { KeyboardEvent } from 'react'

interface UseCardControllerOptions {
  clickable?: boolean
  disabled?: boolean
  onPress?: () => void
  /**
   * When true, we skip adding role/tabIndex since the element is already interactive (e.g., anchor/link)
   */
  isInteractiveElement?: boolean
}

interface UseCardControllerReturn {
  isHovered: boolean
  isFocused: boolean
  isPressed: boolean
  interactionProps: {
    onMouseEnter?: () => void
    onMouseLeave?: () => void
    onMouseDown?: () => void
    onMouseUp?: () => void
    onFocus?: () => void
    onBlur?: () => void
    onKeyDown?: (event: KeyboardEvent) => void
    onKeyUp?: (event: KeyboardEvent) => void
    role?: string
    tabIndex?: number
  }
}

export const useCardController = ({
  clickable = false,
  disabled = false,
  onPress,
  isInteractiveElement = false,
}: UseCardControllerOptions = {}): UseCardControllerReturn => {
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  const handlePress = useCallback(() => {
    if (disabled) return
    onPress?.()
  }, [disabled, onPress])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!clickable || disabled) return
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault()
        setIsPressed(true)
      }
    },
    [clickable, disabled]
  )

  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      if (!clickable || disabled) return
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault()
        setIsPressed(false)
        handlePress()
      }
    },
    [clickable, disabled, handlePress]
  )

  const interactionProps = useMemo(() => {
    // If not clickable, don't add any interaction handlers at all
    if (!clickable) {
      return {} as Record<string, never>
    }

    const baseHandlers = {
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => {
        setIsHovered(false)
        setIsPressed(false)
      },
      onMouseDown: () => {
        if (!disabled) setIsPressed(true)
      },
      onMouseUp: () => setIsPressed(false),
      onFocus: () => setIsFocused(true),
      onBlur: () => {
        setIsFocused(false)
        setIsPressed(false)
      },
    }

    if (disabled) {
      return baseHandlers
    }

    return {
      ...baseHandlers,
      onKeyDown: handleKeyDown,
      onKeyUp: handleKeyUp,
      ...(isInteractiveElement
        ? {}
        : {
            role: 'button',
            tabIndex: 0,
          }),
    }
  }, [clickable, disabled, handleKeyDown, handleKeyUp, isInteractiveElement])

  return {
    isHovered,
    isFocused,
    isPressed,
    interactionProps,
  }
}
