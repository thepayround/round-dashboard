import {
  Edit,
  Trash2,
  Crown
} from 'lucide-react'
import React from 'react'

import type { TeamMember, UserRole } from '../types/team.types'

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  SortableTableHead,
  Badge,
  Avatar,
  type BadgeVariant
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
  isLoading?: boolean
}

const TeamMembersTable: React.FC<TeamMembersTableProps> = ({
  members,
  sortConfig,
  onSort,
  onEditMember,
  onRemoveMember,
  isLoading = false
}) => {
  const roleLabels: Record<UserRole, { label: string; variant: BadgeVariant }> = {
    SuperAdmin: { label: 'Super Admin', variant: 'success' },
    Admin: { label: 'Admin', variant: 'warning' },
    TeamManager: { label: 'Team Manager', variant: 'info' },
    TeamMember: { label: 'Team Member', variant: 'success' },
    Sales: { label: 'Sales', variant: 'info' },
    Finance: { label: 'Finance', variant: 'warning' },
    Support: { label: 'Support', variant: 'primary' },
    Viewer: { label: 'Viewer', variant: 'neutral' }
  }

  const formatDate = (dateString: string) => new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(dateString))

  return (
    <div className="border border-white/8 rounded-lg overflow-hidden relative">
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
                >
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar name={member.fullName || `${member.firstName} ${member.lastName}`} />
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
                    <Badge variant={roleConfig.variant} size="md">
                      {member.roleName || roleConfig.label}
                    </Badge>
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
      { isLoading && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="text-white/60">Loading...</div>
        </div>
      )}
    </div>
  )
}

export default TeamMembersTable

