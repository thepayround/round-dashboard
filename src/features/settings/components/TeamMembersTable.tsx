import { motion } from 'framer-motion'
import {
  Edit,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Crown
} from 'lucide-react'
import React, { useState } from 'react'

import type { TeamMember, UserRole } from '../types/team.types'

import { IconButton } from '@/shared/components/Button'

interface SortConfig {
  field: string
  direction: 'asc' | 'desc'
}

interface TeamMembersTableProps {
  members: TeamMember[]
  sortConfig: SortConfig
  onSort: (field: string) => void
  onEditMember: (member: TeamMember) => void
  onRemoveMember: (member: TeamMember) => void
  loading?: boolean
}

const TeamMembersTable: React.FC<TeamMembersTableProps> = ({
  members,
  sortConfig,
  onSort,
  onEditMember,
  onRemoveMember,
  loading = false
}) => {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)

  const roleLabels: Record<UserRole, { label: string; color: string }> = {
    SuperAdmin: { label: 'Super Admin', color: 'text-green-400' },
    Admin: { label: 'Admin', color: 'text-orange-400' },
    TeamManager: { label: 'Team Manager', color: 'text-blue-400' },
    TeamMember: { label: 'Team Member', color: 'text-green-400' },
    Sales: { label: 'Sales', color: 'text-cyan-400' },
    Finance: { label: 'Finance', color: 'text-yellow-400' },
    Support: { label: 'Support', color: 'text-indigo-400' },
    Viewer: { label: 'Viewer', color: 'text-gray-400' }
  }

  const formatDate = (dateString: string) => new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(dateString))

  const getInitials = (firstName: string, lastName: string) =>
    `${firstName[0]}${lastName[0]}`.toUpperCase()

  const TableHeader = ({ field, children, className = '' }: {
    field?: string
    children: React.ReactNode
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
    <div className="border border-white/10 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#171719] border-b border-white/10">
            <tr>
              <TableHeader field="fullName">Member</TableHeader>
              <TableHeader field="email">Email</TableHeader>
              <TableHeader field="role">Role</TableHeader>
              <TableHeader field="joinedAt">Joined</TableHeader>
              <TableHeader className="text-right">Actions</TableHeader>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#16171a]">
            {members.map((member) => {
              const roleConfig = roleLabels[member.role] || roleLabels.TeamMember
              return (
                <motion.tr
                  key={member.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`transition-all duration-200 border-b border-[#16171a] bg-[#101011] ${
                    hoveredRow === member.id ? 'hover:bg-[#171719]' : 'hover:bg-[#171719]'
                  }`}
                  onMouseEnter={() => setHoveredRow(member.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-medium text-xs tracking-tight">
                        {getInitials(member.firstName, member.lastName)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                          <div className="font-normal text-white tracking-tight truncate">
                            {member.fullName || `${member.firstName} ${member.lastName}`}
                          </div>
                          {member.isOwner && (
                            <Crown className="w-4 h-4 text-yellow-400 flex-shrink-0" aria-label="Owner" />
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-white/80 truncate">{member.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-normal tracking-tight bg-${roleConfig.color.split('-')[1]}-500/20 ${roleConfig.color} border border-${roleConfig.color.split('-')[1]}-500/30`}>
                      {member.roleName || roleConfig.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-white/80">{formatDate(member.joinedAt)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <IconButton
                        icon={Edit}
                        onClick={() => onEditMember(member)}
                        aria-label="Edit member role"
                        size="md"
                      />
                      {!member.isOwner && (
                        <IconButton
                          icon={Trash2}
                          onClick={() => onRemoveMember(member)}
                          aria-label="Remove member"
                          variant="danger"
                          size="md"
                        />
                      )}
                    </div>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="text-white/60">Loading...</div>
        </div>
      )}
    </div>
  )
}

export default TeamMembersTable
