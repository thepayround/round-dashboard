import React, { useCallback, useMemo } from 'react'

import { Input } from '../../ui/shadcn/input'
import { Label } from '../../ui/shadcn/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/shadcn/select'
import type { ActiveFilter } from '../FilterChipsBar'

import type { FilterField, SearchFilterToolbarProps } from './SearchFilterToolbar'


interface UseSearchFilterToolbarControllerParams {
  filterFields?: FilterField[]
  searchQuery: string
  searchResults?: SearchFilterToolbarProps['searchResults']
}

interface UseSearchFilterToolbarControllerReturn {
  activeFilters: ActiveFilter[]
  hasActiveFilters: boolean
  renderFilterField: (field: FilterField) => React.ReactNode
  shouldShowSearchSummary: boolean
  searchSummaryLabel: string
}

export const useSearchFilterToolbarController = ({
  filterFields = [],
  searchQuery,
  searchResults,
}: UseSearchFilterToolbarControllerParams): UseSearchFilterToolbarControllerReturn => {
  const renderFilterField = useCallback((field: FilterField) => {
    switch (field.type) {
      case 'select':
        return (
          <div key={field.id} className="space-y-2">
            <Label>{field.label}</Label>
            <Select
              value={String(field.value)}
              onValueChange={(selectedValue: string) => field.onChange(selectedValue)}
            >
              <SelectTrigger>
                <SelectValue placeholder={field.placeholder ?? `Select ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.id} value={option.value ?? option.id}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )
      case 'input':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>{field.label}</Label>
            <Input
              id={field.id}
              type="text"
              value={String(field.value)}
              onChange={event => field.onChange(event.target.value)}
              placeholder={field.placeholder}
            />
          </div>
        )
      case 'date':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>{field.label}</Label>
            <Input
              id={field.id}
              type="date"
              value={String(field.value)}
              onChange={event => field.onChange(event.target.value)}
            />
          </div>
        )
      case 'custom':
        return (
          <div key={field.id}>
            <span className="block text-sm font-normal text-white/80 tracking-tight mb-2">
              {field.label}
            </span>
            {field.component}
          </div>
        )
      default:
        return null
    }
  }, [])

  const activeFilters: ActiveFilter[] = useMemo(
    () =>
      filterFields
        .filter(field => {
          const { value } = field
          return value !== '' && value !== null && value !== undefined
        })
        .map(field => {
          let displayValue = String(field.value)
          if (field.options && field.type === 'select') {
            const option = field.options.find(opt => (opt.value ?? opt.id) === String(field.value))
            if (option) {
              displayValue = option.name
            }
          }

          return {
            id: field.id,
            label: field.label,
            value: String(field.value ?? ''),
            displayValue,
            onRemove: () => {
              if (field.onClear) {
                field.onClear()
              } else {
                field.onChange('')
              }
            },
          }
        }),
    [filterFields]
  )

  const shouldShowSearchSummary = useMemo(() => {
    if (!searchResults) return false
    return Boolean(searchQuery) || searchResults.filtered < searchResults.total
  }, [searchQuery, searchResults])

  const searchSummaryLabel = useMemo(() => {
    if (!searchResults) return ''

    if (searchResults.filtered === searchResults.total) {
      const plural = searchResults.total === 1 ? '' : 's'
      return `${searchResults.total} result${plural}`
    }

    const plural = searchResults.filtered === 1 ? '' : 's'
    return `${searchResults.filtered} of ${searchResults.total} result${plural}`
  }, [searchResults])

  return {
    activeFilters,
    hasActiveFilters: activeFilters.length > 0,
    renderFilterField,
    shouldShowSearchSummary,
    searchSummaryLabel,
  }
}
