import { motion, AnimatePresence } from 'framer-motion'
import { MoreHorizontal } from 'lucide-react'
import type { ReactNode } from 'react';
import { useState, useRef, useEffect } from 'react'

import { Button } from '../../ui/shadcn/button'

export interface ActionMenuItem {
  id: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
  onClick: () => void
  variant?: 'default' | 'danger' | 'warning'
  disabled?: boolean
  divider?: boolean
}

interface ActionMenuProps {
  items: ActionMenuItem[]
  trigger?: ReactNode
  position?: 'left' | 'right' | 'center'
  className?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export const ActionMenu = ({
  items,
  trigger,
  position = 'right',
  className = '',
  disabled = false,
  size = 'md'
}: ActionMenuProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const menuRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const positionClasses = {
    left: 'right-full mr-1',
    right: 'left-full ml-1',
    center: 'left-1/2 -translate-x-1/2'
  }

  const variantClasses = {
    default: 'text-foreground hover:bg-muted',
    danger: 'text-destructive hover:bg-destructive/10',
    warning: 'text-warning hover:bg-warning/10'
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) &&
          triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setFocusedIndex(-1)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
        setFocusedIndex(-1)
        triggerRef.current?.focus()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen) return

    const enabledItems = items.filter(item => !item.disabled)
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setFocusedIndex(prev => 
          prev < enabledItems.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        event.preventDefault()
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : enabledItems.length - 1
        )
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        if (focusedIndex >= 0 && focusedIndex < enabledItems.length) {
          enabledItems[focusedIndex].onClick()
          setIsOpen(false)
          setFocusedIndex(-1)
        }
        break
    }
  }

  const handleTriggerClick = () => {
    if (disabled) return
    setIsOpen(!isOpen)
    if (!isOpen) {
      setFocusedIndex(0)
    }
  }

  const handleItemClick = (item: ActionMenuItem) => {
    if (item.disabled) return
    item.onClick()
    setIsOpen(false)
    setFocusedIndex(-1)
  }

  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'h-8 w-8'
      case 'lg': return 'h-12 w-12'
      default: return 'h-10 w-10'
    }
  }

  return (
    <div className={`relative ${className}`}>
      {trigger ? (
        <Button
          ref={triggerRef}
          onClick={handleTriggerClick}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          variant="ghost"
          className={`p-0 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          aria-label="Actions menu"
        >
          {trigger}
        </Button>
      ) : (
        <Button
          ref={triggerRef}
          onClick={handleTriggerClick}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          variant="ghost"
          size="icon"
          className={`opacity-0 group-hover:opacity-100 transition-opacity ${getSizeClass()}`}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          aria-label="Actions menu"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className={`absolute top-full mt-1 z-50 bg-black/90 border border-border rounded-lg py-1 min-w-[160px] shadow-xl ${positionClasses[position]}`}
            role="menu"
            aria-orientation="vertical"
          >
            {items.map((item, _index) => {
              const Icon = item.icon
              const isEnabled = !item.disabled
              const isFocused = focusedIndex === items.filter(i => !i.disabled).indexOf(item)
              
              return (
                <div key={item.id}>
                  {item.divider && (
                    <div className="h-px bg-white/10 my-1" role="separator" />
                  )}
                  <Button
                    onClick={() => handleItemClick(item)}
                    disabled={item.disabled}
                    variant="ghost"
                    className={`w-full justify-start gap-2 px-3 py-2 text-sm transition-colors rounded-md mx-1 h-auto ${
                      isEnabled
                        ? `${variantClasses[item.variant ?? 'default']} ${
                            isFocused ? 'bg-white/20' : ''
                          }`
                        : 'text-gray-500 cursor-not-allowed'
                    }`}
                    role="menuitem"
                    tabIndex={isEnabled ? 0 : -1}
                    aria-disabled={item.disabled}
                  >
                    {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
                    <span>{item.label}</span>
                  </Button>
                </div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
