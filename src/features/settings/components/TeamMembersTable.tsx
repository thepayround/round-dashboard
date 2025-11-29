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
  Badge,
  Button,
  Avatar,
  AvatarFallback,
  type BadgeProps
} from '@/shared/ui'

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
  const roleLabels: Record<UserRole, { label: string; variant: BadgeProps['variant'] }> = {
    SuperAdmin: { label: 'Super Admin', variant: 'default' },
    Admin: { label: 'Admin', variant: 'secondary' },
    TeamManager: { label: 'Team Manager', variant: 'outline' },
    TeamMember: { label: 'Team Member', variant: 'default' },
    Sales: { label: 'Sales', variant: 'outline' },
    Finance: { label: 'Finance', variant: 'secondary' },
    Support: { label: 'Support', variant: 'default' },
    Viewer: { label: 'Viewer', variant: 'outline' }
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
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onSort('fullName')}
              >
                Member {sortConfig.field === 'fullName' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onSort('email')}
              >
                Email {sortConfig.field === 'email' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onSort('role')}
              >
                Role {sortConfig.field === 'role' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onSort('joinedAt')}
              >
                Joined {sortConfig.field === 'joinedAt' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </TableHead>
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
                      <Avatar>
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {(member.fullName || `${member.firstName} ${member.lastName}`)
                            .split(' ')
                            .map(n => n[0])
                            .join('')
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
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
                    <Badge variant={roleConfig.variant}>
                      {member.roleName || roleConfig.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-white/80">{formatDate(member.joinedAt)}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onEditMember(member)}
                        aria-label="Edit member role"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {!member.isOwner && (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onRemoveMember(member)}
                          aria-label="Remove member"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
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

