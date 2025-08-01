import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Download, Eye, Edit, Trash2 } from 'lucide-react'
import { DashboardLayout } from '@/shared/components/DashboardLayout'
import { CreateButton, Card, SearchFilterToolbar, SectionHeader } from '@/shared/components'
import type { FilterField } from '@/shared/components'

export const InvoicesPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'text-[#42E695] bg-[#42E695]/20 border-[#42E695]/30'
      case 'pending':
        return 'text-[#FFC107] bg-[#FFC107]/20 border-[#FFC107]/30'
      case 'overdue':
        return 'text-[#FF4E50] bg-[#FF4E50]/20 border-[#FF4E50]/30'
      case 'draft':
        return 'text-[#7767DA] bg-[#7767DA]/20 border-[#7767DA]/30'
      default:
        return 'text-white/70 bg-white/10 border-white/20'
    }
  }

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

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <SectionHeader
            title="Invoices"
            subtitle="Manage and track all your invoices in one place"
            size="main"
            actions={
              <CreateButton
                label="Create Invoice"
                onClick={() => { /* Create invoice clicked */ }}
                size="md"
              />
            }
          />
        </motion.div>

        {/* Search and Filter Bar */}
        <SearchFilterToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search invoices..."
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          filterFields={filterFields}
          delay={0.1}
          className="mb-8"
          additionalActions={
            <button className="btn-secondary flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          }
        />

        {/* Invoices Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card animate={false}>
          <div className="flex items-center space-x-3 mb-6">
            <FileText className="w-6 h-6 text-[#D417C8]" />
            <h2 className="text-xl font-bold auth-text">All Invoices</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 auth-text-muted font-medium">Invoice ID</th>
                  <th className="text-left py-4 px-4 auth-text-muted font-medium">Customer</th>
                  <th className="text-left py-4 px-4 auth-text-muted font-medium">Amount</th>
                  <th className="text-left py-4 px-4 auth-text-muted font-medium">Status</th>
                  <th className="text-left py-4 px-4 auth-text-muted font-medium">Date</th>
                  <th className="text-left py-4 px-4 auth-text-muted font-medium">Due Date</th>
                  <th className="text-left py-4 px-4 auth-text-muted font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice, index) => (
                  <motion.tr
                    key={invoice.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="border-b border-white/5 hover:bg-white/5 transition-all duration-200"
                  >
                    <td className="py-4 px-4">
                      <span className="font-medium auth-text">{invoice.id}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D417C8]/20 to-[#14BDEA]/20 flex items-center justify-center">
                          <span className="text-xs font-medium auth-text">
                            {invoice.customer.charAt(0)}
                          </span>
                        </div>
                        <span className="auth-text">{invoice.customer}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium auth-text">${invoice.amount.toFixed(2)}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(invoice.status)}`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="auth-text-muted">{invoice.date}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="auth-text-muted">{invoice.dueDate}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-white/70 hover:text-[#32A1E4] hover:bg-[#32A1E4]/20 rounded-lg transition-all duration-200">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-white/70 hover:text-[#7767DA] hover:bg-[#7767DA]/20 rounded-lg transition-all duration-200">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-white/70 hover:text-[#FF4E50] hover:bg-[#FF4E50]/20 rounded-lg transition-all duration-200">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
