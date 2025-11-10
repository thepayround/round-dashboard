import {
  Edit,
  Trash2,
  Crown
} from 'lucide-react'
import React, { useState } from 'react'

import type { TeamMember, UserRole } from '../types/team.types'

import { 
  Table, 
  TableHeader, 
  TableBody,
  TableRow,
  TableHead, 
  TableCell,
  SortableTableHead 
} from '@/shared/ui'
import { IconButton } from '@/shared/ui/Button'

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
  const [_hoveredRow, setHoveredRow] = useState<string | null>(null)

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

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden relative">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableTableHead field="fullName" sortConfig={sortConfig} onSort={onSort}>
                Member
              </SortableTableHead>
              <SortableTableHead field="email" sortConfig={sortConfig} onSort={onSort}>
                Email
              </SortableTableHead>
              <SortableTableHead field="role" sortConfig={sortConfig} onSort={onSort}>
                Role
              </SortableTableHead>
              <SortableTableHead field="joinedAt" sortConfig={sortConfig} onSort={onSort}>
                Joined
              </SortableTableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => {
              const roleConfig = roleLabels[member.role] || roleLabels.TeamMember
              return (
                <TableRow
                  key={member.id}
                  className="transition-colors duration-150"
                  onMouseEnter={() => setHoveredRow(member.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-white/80 truncate">{member.email}</div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-normal tracking-tight bg-${roleConfig.color.split('-')[1]}-500/20 ${roleConfig.color} border border-${roleConfig.color.split('-')[1]}-500/30`}>
                      {member.roleName || roleConfig.label}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-white/80">{formatDate(member.joinedAt)}</div>
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
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

