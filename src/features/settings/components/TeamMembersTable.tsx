import type { ColumnDef } from '@tanstack/react-table'
import { Edit, Trash2, Crown, MoreHorizontal } from 'lucide-react'
import React from 'react'

import type { TeamMember, UserRole } from '../types/team.types'

import {
  DataTable,
  SortableHeader,
} from '@/shared/ui/DataTable/DataTable'
import { Avatar, AvatarFallback } from '@/shared/ui/shadcn/avatar'
import { Badge, type BadgeProps } from '@/shared/ui/shadcn/badge'
import { Button } from '@/shared/ui/shadcn/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/shadcn/dropdown-menu'

interface TeamMembersTableProps {
  members: TeamMember[]
  onEditMember: (member: TeamMember) => void
  onRemoveMember: (member: TeamMember) => void
  isLoading?: boolean
}

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

const TeamMembersTable: React.FC<TeamMembersTableProps> = ({
  members,
  onEditMember,
  onRemoveMember,
  isLoading = false
}) => {
  const columns: ColumnDef<TeamMember, unknown>[] = [
    {
      accessorKey: 'fullName',
      header: ({ column }) => (
        <SortableHeader column={column}>Member</SortableHeader>
      ),
      cell: ({ row }) => {
        const member = row.original
        const displayName = member.fullName || `${member.firstName} ${member.lastName}`
        return (
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarFallback className="bg-primary/10 text-primary">
                {displayName
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <div className="font-normal text-foreground tracking-tight truncate">
                  {displayName}
                </div>
                {member.isOwner && (
                  <Crown className="w-4 h-4 text-yellow-400 flex-shrink-0" aria-label="Owner" />
                )}
              </div>
            </div>
          </div>
        )
      },
      enableHiding: false,
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <SortableHeader column={column}>Email</SortableHeader>
      ),
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground truncate">{row.original.email}</div>
      ),
    },
    {
      accessorKey: 'role',
      header: ({ column }) => (
        <SortableHeader column={column}>Role</SortableHeader>
      ),
      cell: ({ row }) => {
        const member = row.original
        const roleConfig = roleLabels[member.role] || roleLabels.TeamMember
        return (
          <Badge variant={roleConfig.variant}>
            {member.roleName || roleConfig.label}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'joinedAt',
      header: ({ column }) => (
        <SortableHeader column={column}>Joined</SortableHeader>
      ),
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">{formatDate(row.original.joinedAt)}</div>
      ),
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const member = row.original
        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    onEditMember(member)
                  }}
                >
                  <Edit className="h-4 w-4" />
                  Edit Role
                </DropdownMenuItem>
                {!member.isOwner && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemoveMember(member)
                    }}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
      enableSorting: false,
      enableHiding: false,
    }
  ]

  return (
    <DataTable
      data={members}
      columns={columns}
      isLoading={isLoading}
      showPagination={true}
      showSearch={false}
      pageSize={10}
      emptyMessage="No team members found."
    />
  )
}

export default TeamMembersTable
