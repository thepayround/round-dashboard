import type { Meta, StoryObj } from '@storybook/react'
import { Eye, Edit, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { IconButton } from '../Button'

import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, SortableTableHead } from './Table'

const meta: Meta<typeof Table> = {
  title: 'UI/Layout/Table',
  component: Table,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Table>

const customers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', company: 'Acme Inc', status: 'Active' },
  { id: '2', name: 'Jane Smith', email: 'jane@company.com', company: 'Tech Corp', status: 'Active' },
  { id: '3', name: 'Bob Johnson', email: 'bob@startup.io', company: 'StartupXYZ', status: 'Inactive' },
]

export const Basic: Story = {
  render: () => (
    <div className="p-6 bg-[#0a0a0a]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Company</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>{customer.name}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{customer.company}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
}

export const WithActions: Story = {
  render: () => (
    <div className="p-6 bg-[#0a0a0a]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>{customer.name}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>
                <div className="flex justify-end gap-2">
                  <IconButton icon={Eye} aria-label="View" size="sm" />
                  <IconButton icon={Edit} aria-label="Edit" size="sm" />
                  <IconButton icon={Trash2} aria-label="Delete" variant="danger" size="sm" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
}

export const Sortable: Story = {
  render: () => {
    const [sortConfig, setSortConfig] = useState({ field: 'name', direction: 'asc' as 'asc' | 'desc' })

    const handleSort = (field: string) => {
      setSortConfig({
        field,
        direction: sortConfig.field === field && sortConfig.direction === 'asc' ? 'desc' : 'asc',
      })
    }

    return (
      <div className="p-6 bg-[#0a0a0a]">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableTableHead field="name" sortConfig={sortConfig} onSort={handleSort}>
                Name
              </SortableTableHead>
              <SortableTableHead field="email" sortConfig={sortConfig} onSort={handleSort}>
                Email
              </SortableTableHead>
              <SortableTableHead field="company" sortConfig={sortConfig} onSort={handleSort}>
                Company
              </SortableTableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.company}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  },
}

export const WithStatus: Story = {
  render: () => (
    <div className="p-6 bg-[#0a0a0a]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>{customer.name}</TableCell>
              <TableCell className="text-white/60">{customer.email}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    customer.status === 'Active'
                      ? 'bg-[#38D39F]/10 text-[#38D39F] border border-[#38D39F]/40'
                      : 'bg-[#262626] text-white/60 border border-white/10'
                  }`}
                >
                  {customer.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
}

