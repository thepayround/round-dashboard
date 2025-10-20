import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Eye,
  Edit,
  MoreHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X
} from 'lucide-react'
import type { CustomerResponse } from '@/shared/services/api/customer.service'

interface SortConfig {
  field: string
  direction: 'asc' | 'desc'
}

interface CustomerTableProps {
  customers: CustomerResponse[]
  sortConfig: SortConfig
  onSort: (field: string) => void
  loading?: boolean
  selectable?: boolean
  onSelectionChange?: (selectedIds: string[]) => void
  selectedIds?: string[]
}

const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  sortConfig,
  onSort,
  loading = false,
  selectable = false,
  onSelectionChange,
  selectedIds = []
}) => {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)

  const getStatusText = (status: number | string): string => {
    const statusValue = typeof status === 'string' ? parseInt(status) : status
    
    switch (statusValue) {
      case 1: return 'Active'
      case 2: return 'Inactive'
      case 3: return 'Suspended'
      case 4: return 'Cancelled'
      default: return 'Unknown'
    }
  }

  const getStatusClass = (status: number | string): string => {
    const statusValue = typeof status === 'string' ? parseInt(status) : status
    
    switch (statusValue) {
      case 1: return 'bg-green-500/20 text-green-400 border border-green-500/30'
      case 2: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
      case 3: return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
      case 4: return 'bg-red-500/20 text-red-400 border border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
    }
  }

  const formatDate = (dateString: string) => new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(dateString))

  const getInitials = (displayName: string) => displayName
    .split(' ')
    .map(name => name[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  const handleSelectAll = (checked: boolean) => {
    if (onSelectionChange) {
      onSelectionChange(checked ? customers.map(c => c.id) : [])
    }
  }

  const handleSelectRow = (customerId: string, checked: boolean) => {
    if (onSelectionChange) {
      const newSelection = checked
        ? [...selectedIds, customerId]
        : selectedIds.filter(id => id !== customerId)
      onSelectionChange(newSelection)
    }
  }

  const isAllSelected = selectedIds.length === customers.length && customers.length > 0
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < customers.length

  const TableHeader = ({ field, children, className = "" }: { 
    field?: string; 
    children: React.ReactNode; 
    className?: string 
  }) => (
    <th className={`px-6 py-4 text-left text-sm font-normal text-white/80 tracking-tight ${className}`}>
      {field ? (
        <button
          onClick={() => onSort(field)}
          className="flex items-center space-x-2 hover:text-white transition-colors group"
        >
          <span>{children}</span>
          {(() => {
            if (sortConfig.field !== field) {
              return <ArrowUpDown className="w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity" />
            }
            if (sortConfig.direction === 'asc') {
              return <ArrowUp className="w-4 h-4" />
            }
            return <ArrowDown className="w-4 h-4" />
          })()}
        </button>
      ) : (
        children
      )}
    </th>
  )

  return (
    <div className="bg-[#171719] border border-[#1e1f22] rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#171719] border-b border-[#1e1f22]">
            <tr>
              {selectable && (
                <TableHeader className="w-12">
                  <div className="flex items-center">
                    <label htmlFor="select-all" className="flex items-center cursor-pointer group">
                      <span className="sr-only">Select all customers</span>
                      <div 
                        className={`
                          flex items-center justify-center
                          w-9 h-9 rounded-lg
                          transition-all duration-200
                          ${isAllSelected || isIndeterminate
                            ? 'bg-[#D417C8]/10 border-2 border-[#D417C8]' 
                            : 'bg-[#1d1d20] border border-[#25262a] group-hover:bg-[#212124] group-hover:border-[#2c2d31]'
                          }
                        `}
                      >
                        <div className={`flex items-center justify-center w-4 h-4 rounded border-2 transition-all ${
                          isAllSelected || isIndeterminate
                            ? 'bg-[#D417C8] border-[#D417C8]'
                            : 'bg-transparent border-[#2c2d31]'
                        }`}>
                          {isAllSelected && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                          {isIndeterminate && !isAllSelected && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 12h14" />
                            </svg>
                          )}
                        </div>
                        <input
                          id="select-all"
                          type="checkbox"
                          checked={isAllSelected}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="sr-only"
                        />
                      </div>
                    </label>
                  </div>
                </TableHeader>
              )}
              <TableHeader field="displayName">Customer</TableHeader>
              <TableHeader field="email">Contact</TableHeader>
              <TableHeader field="company">Company</TableHeader>
              <TableHeader field="status">Status</TableHeader>
              <TableHeader field="currency">Currency</TableHeader>
              <TableHeader field="signupDate">Joined</TableHeader>
              <TableHeader className="text-right">Actions</TableHeader>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#16171a]">
            {customers.map((customer) => (
              <motion.tr
                key={customer.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`transition-all duration-200 border-b border-[#16171a] bg-[#101011] ${(() => {
                  if (hoveredRow === customer.id) return 'hover:bg-[#171719]'
                  if (selectedIds.includes(customer.id)) return 'bg-[#D417C8]/5'
                  return 'hover:bg-[#171719]'
                })()}`}
                onMouseEnter={() => setHoveredRow(customer.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                {selectable && (
                  <td className="px-6 py-4">
                    <label htmlFor={`select-${customer.id}`} className="flex items-center cursor-pointer group">
                      <span className="sr-only">Select customer {customer.displayName}</span>
                      <div 
                        className={`
                          flex items-center justify-center
                          w-9 h-9 rounded-lg
                          transition-all duration-200
                          ${selectedIds.includes(customer.id) 
                            ? 'bg-[#D417C8]/10 border-2 border-[#D417C8]' 
                            : 'bg-[#1d1d20] border border-[#25262a] group-hover:bg-[#212124] group-hover:border-[#2c2d31]'
                          }
                        `}
                      >
                        <div className={`flex items-center justify-center w-4 h-4 rounded border-2 transition-all ${
                          selectedIds.includes(customer.id)
                            ? 'bg-[#D417C8] border-[#D417C8]'
                            : 'bg-transparent border-[#2c2d31]'
                        }`}>
                          {selectedIds.includes(customer.id) && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <input
                          id={`select-${customer.id}`}
                          type="checkbox"
                          checked={selectedIds.includes(customer.id)}
                          onChange={(e) => handleSelectRow(customer.id, e.target.checked)}
                          className="sr-only"
                        />
                      </div>
                    </label>
                  </td>
                )}
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D417C8] to-[#14BDEA] flex items-center justify-center text-white font-medium text-xs tracking-tight">
                      {getInitials(customer.displayName)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <div className="font-normal text-white tracking-tight truncate">
                          {customer.effectiveDisplayName ?? customer.displayName}
                        </div>
                        {customer.isBusinessCustomer && (
                          <span className="px-2 py-1 bg-[#14BDEA]/20 text-[#14BDEA] border border-[#14BDEA]/30 rounded text-xs font-normal tracking-tight flex-shrink-0">
                            Business
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-white/60 truncate">
                        {customer.firstName} {customer.lastName}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="text-sm text-white/80 truncate">{customer.email}</div>
                    {customer.phoneNumber && (
                      <div className="text-sm text-white/60 truncate">{customer.phoneNumber}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-white/80 truncate">
                    {customer.company ?? '-'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-normal tracking-tight ${getStatusClass(customer.status)}`}>
                      {getStatusText(customer.status)}
                    </span>
                    {customer.portalAccess && (
                      <div className="w-2 h-2 bg-[#42E695] rounded-full" title="Portal Access Enabled" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-white/80">{customer.currency}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-white/80">{formatDate(customer.signupDate)}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end space-x-2">
                    <Link
                      to={`/customers/${customer.id}`}
                      className="p-2 text-white/50 hover:text-[#14BDEA] hover:bg-[#14BDEA]/10 rounded-lg transition-all duration-200"
                      title="View customer"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/customers/${customer.id}/edit`}
                      className="p-2 text-white/50 hover:text-[#D417C8] hover:bg-[#D417C8]/10 rounded-lg transition-all duration-200"
                      title="Edit customer"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button 
                      className="p-2 text-[#a3a3a3] hover:text-white hover:bg-[#1d1d20] rounded-lg transition-all duration-200"
                      title="More actions"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Selection Info Bar */}
      {selectable && selectedIds.length > 0 && (
        <div className="border-t border-[#1e1f22] px-6 py-3 bg-[#171719]">
          <div className="flex items-center justify-between">
            <div className="text-sm text-[#a3a3a3]">
              {selectedIds.length} customer{selectedIds.length === 1 ? '' : 's'} selected
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 text-sm text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors">
                Export Selected
              </button>
              <button className="px-3 py-1 text-sm text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors">
                Bulk Edit
              </button>
              <button 
                onClick={() => onSelectionChange?.([])}
                className="p-1 text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors"
                title="Clear selection"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="text-white/60">Loading...</div>
        </div>
      )}
    </div>
  )
}

export default CustomerTable