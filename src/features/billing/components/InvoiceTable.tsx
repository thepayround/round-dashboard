import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, Edit, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'

interface Invoice {
  id: string
  customer: string
  amount: number
  status: string
  date: string
  dueDate: string
}

interface SortConfig {
  field: string
  direction: 'asc' | 'desc'
}

interface InvoiceTableProps {
  invoices: Invoice[]
  sortConfig: SortConfig
  onSort: (field: string) => void
  loading?: boolean
}

export const InvoiceTable: React.FC<InvoiceTableProps> = ({
  invoices,
  sortConfig,
  onSort,
  loading = false
}) => {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-[#42E695]/20 text-[#42E695] border border-[#42E695]/30'
      case 'pending':
        return 'bg-[#FFC107]/20 text-[#FFC107] border border-[#FFC107]/30'
      case 'overdue':
        return 'bg-[#FF4E50]/20 text-[#FF4E50] border border-[#FF4E50]/30'
      case 'draft':
        return 'bg-[#7767DA]/20 text-[#7767DA] border border-[#7767DA]/30'
      default:
        return 'bg-white/10 text-white/70 border border-white/20'
    }
  }

  const getInitials = (name: string) => name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  const TableHeader = ({ field, children, className = "" }: { 
    field?: string; 
    children: React.ReactNode; 
    className?: string 
  }) => (
    <th className={`px-6 py-4 text-left text-sm font-normal tracking-tight tracking-tight text-white/80 ${className}`}>
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
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-[#101011]/90 z-10 flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 border-2 border-[#D417C8] border-t-transparent rounded-full animate-spin" />
            <p className="text-white/70">Loading invoices...</p>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#171719] border-b border-[#1e1f22]">
            <tr>
              <TableHeader field="id">Invoice ID</TableHeader>
              <TableHeader field="customer">Customer</TableHeader>
              <TableHeader field="amount">Amount</TableHeader>
              <TableHeader field="status">Status</TableHeader>
              <TableHeader field="date">Date</TableHeader>
              <TableHeader field="dueDate">Due Date</TableHeader>
              <TableHeader className="text-right">Actions</TableHeader>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e1f22]">
            {invoices.map((invoice) => (
              <motion.tr
                key={invoice.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`transition-all duration-200 bg-[#101011] ${
                  hoveredRow === invoice.id ? 'bg-[#171719]' : 'hover:bg-[#171719]'
                }`}
                onMouseEnter={() => setHoveredRow(invoice.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="px-6 py-4">
                  <div className="font-medium text-white">{invoice.id}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-medium text-xs tracking-tight">
                      {getInitials(invoice.customer)}
                    </div>
                    <div className="font-medium text-white">{invoice.customer}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-white">${invoice.amount.toFixed(2)}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-normal tracking-tight ${getStatusColor(invoice.status)}`}>
                    {invoice.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-white/80">{invoice.date}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-white/80">{invoice.dueDate}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      className="p-2 text-white/50 hover:text-[#14BDEA] hover:bg-[#14BDEA]/10 rounded-lg transition-all duration-200"
                      title="View invoice"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 text-white/50 hover:text-[#D417C8] hover:bg-[#D417C8]/10 rounded-lg transition-all duration-200"
                      title="Edit invoice"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 text-white/50 hover:text-[#FF4E50] hover:bg-[#FF4E50]/10 rounded-lg transition-all duration-200"
                      title="Delete invoice"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {!loading && invoices.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-white/60 text-sm">No invoices found</p>
        </div>
      )}
    </div>
  )
}
