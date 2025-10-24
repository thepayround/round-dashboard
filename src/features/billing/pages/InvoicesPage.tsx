import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { FileText, Download } from 'lucide-react'
import { DashboardLayout } from '@/shared/components/DashboardLayout'
import { ActionButton, SearchFilterToolbar } from '@/shared/components'
import type { FilterField } from '@/shared/components'
import { useDebouncedSearch } from '@/shared/hooks/useDebouncedSearch'
import { InvoiceTable } from '../components/InvoiceTable'

interface SortConfig {
  field: string
  direction: 'asc' | 'desc'
}

export const InvoicesPage = () => {
  const [showFilters, setShowFilters] = useState(false)
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'date', direction: 'desc' })
  
  const invoices = [
    {
      id: 'INV-001',
      customer: 'Acme Corporation',
      amount: 1250.0,
      status: 'Paid',
      date: '2024-01-15',
      dueDate: '2024-02-15',
    },
    {
      id: 'INV-002',
      customer: 'TechStart Inc.',
      amount: 850.0,
      status: 'Pending',
      date: '2024-01-12',
      dueDate: '2024-02-12',
    },
    {
      id: 'INV-003',
      customer: 'Global Solutions LLC',
      amount: 2100.0,
      status: 'Overdue',
      date: '2024-01-08',
      dueDate: '2024-02-08',
    },
    {
      id: 'INV-004',
      customer: 'Creative Agency',
      amount: 675.0,
      status: 'Draft',
      date: '2024-01-20',
      dueDate: '2024-02-20',
    },
    {
      id: 'INV-005',
      customer: 'Enterprise Corp',
      amount: 3200.0,
      status: 'Paid',
      date: '2024-01-10',
      dueDate: '2024-02-10',
    },
  ]

  // Search fields extraction function
  const getInvoiceSearchFields = useCallback((invoice: typeof invoices[0]): string[] => [
    invoice.id || '',
    invoice.customer || '',
    invoice.status || '',
    invoice.amount?.toString() || ''
  ], [])

  // Use debounced search
  const {
    searchQuery,
    setSearchQuery,
    filteredItems: filteredInvoices,
    isSearching,
    clearSearch,
    totalCount,
    filteredCount
  } = useDebouncedSearch({
    items: invoices,
    searchFields: getInvoiceSearchFields,
    debounceMs: 300
  })

  const filterFields: FilterField[] = [
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      value: '',
      onChange: () => {
        // Status filter changed handler
      },
      options: [
        { id: 'all', name: 'All Statuses' },
        { id: 'paid', name: 'Paid' },
        { id: 'pending', name: 'Pending' },
        { id: 'overdue', name: 'Overdue' },
        { id: 'draft', name: 'Draft' }
      ]
    }
  ]

  const handleSort = (field: string) => {
    setSortConfig(current => ({
      field,
      direction: current.field === field && current.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-end"
        >
          <ActionButton
            label="Create Invoice"
            onClick={() => { /* Create invoice clicked */ }}
            size="md"
            animated={false}
          />
        </motion.div>

        {/* Search and Filter Bar */}
        <SearchFilterToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search invoices by ID, customer, status, or amount..."
          isSearching={isSearching}
          onClearSearch={clearSearch}
          searchResults={{
            total: totalCount,
            filtered: filteredCount
          }}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          filterFields={filterFields}
          additionalActions={
            <button className="btn-secondary flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          }
          className="mb-6"
        />

        {/* Invoices Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#D417C8]" />
            </div>
            <h2 className="text-xl font-normal tracking-tight text-white">Invoices</h2>
          </div>
          
          <InvoiceTable
            invoices={filteredInvoices}
            sortConfig={sortConfig}
            onSort={handleSort}
            loading={isSearching}
          />
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
