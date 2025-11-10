import { motion } from 'framer-motion'
import {
  Users,
  UserPlus,
  Mail,
  Shield,
  Loader2,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Crown
} from 'lucide-react'
import React, { useState, useEffect, useCallback } from 'react'

import { EditMemberModal } from '../components/EditMemberModal'
import { InviteMemberModal } from '../components/InviteMemberModal'
import TeamMembersTable from '../components/TeamMembersTable'
import { useTeamManagement } from '../hooks/useTeamManagement'
import type { TeamMember, TeamInvitation, UserRole } from '../types/team.types'

import { useDebouncedSearch } from '@/shared/hooks/useDebouncedSearch'
import { useRoundAccount } from '@/shared/hooks/useRoundAccount'
import { ActionButton } from '@/shared/ui/ActionButton'
import { ApiDropdown, teamRoleDropdownConfig } from '@/shared/ui/ApiDropdown'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { ConfirmDialog } from '@/shared/widgets/ConfirmDialog'
import type { FilterField } from '@/shared/widgets/SearchFilterToolbar'
import { SearchFilterToolbar } from '@/shared/widgets/SearchFilterToolbar'




export const TeamManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'members' | 'invitations'>('members')
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [_selectedInvitation, _setSelectedInvitation] = useState<TeamInvitation | null>(null)
  const [sortConfig, setSortConfig] = useState<{ field: string; direction: 'asc' | 'desc' }>({
    field: 'fullName',
    direction: 'asc'
  })

  const { roundAccount} = useRoundAccount()
  const roundAccountId = roundAccount?.roundAccountId

  const {
    members,
    invitations,
    isLoading,
    error,
    inviteMember,
    updateMemberRole,
    removeMember,
    resendInvitation,
    cancelInvitation,
    refresh
  } = useTeamManagement()


  useEffect(() => {
    if (roundAccountId) {
      refresh(roundAccountId)
    }
  }, [refresh, roundAccountId])

  // Search fields extraction functions - Memoized for stability
  const getMemberSearchFields = useCallback((member: TeamMember): string[] => [
    member.firstName || '',
    member.lastName || '',
    member.fullName || '',
    member.email || '',
    member.roleName || ''
  ], [])

  const getInvitationSearchFields = useCallback((invitation: TeamInvitation): string[] => [
    invitation.email || '',
    invitation.roleName || '',
    invitation.invitedByName || ''
  ], [])

  // Filter function for role filtering - Stable implementation
  const memberFilterFn = useCallback((member: TeamMember, filters: { roleFilter?: UserRole | 'all' }): boolean => {
    if (filters.roleFilter && filters.roleFilter !== 'all' && member.role !== filters.roleFilter) {
      return false
    }
    return true
  }, [])

  const invitationFilterFn = useCallback((invitation: TeamInvitation, filters: { roleFilter?: UserRole | 'all' }): boolean => {
    if (filters.roleFilter && filters.roleFilter !== 'all' && invitation.role !== filters.roleFilter) {
      return false
    }
    return true
  }, [])

  // Debounced search for members
  const {
    searchQuery: memberSearchQuery,
    setSearchQuery: setMemberSearchQuery,
    filteredItems: searchFilteredMembers,
    isSearching: isMemberSearching,
    clearSearch: clearMemberSearch,
    totalCount: memberTotalCount,
    filteredCount: memberFilteredCount
  } = useDebouncedSearch({
    items: members,
    searchFields: getMemberSearchFields,
    debounceMs: 300,
    filters: { roleFilter },
    filterFn: memberFilterFn
  })

  // Debounced search for invitations
  const {
    searchQuery: invitationSearchQuery,
    setSearchQuery: setInvitationSearchQuery,
    filteredItems: searchFilteredInvitations,
    isSearching: isInvitationSearching,
    clearSearch: clearInvitationSearch,
    totalCount: invitationTotalCount,
    filteredCount: invitationFilteredCount
  } = useDebouncedSearch({
    items: invitations,
    searchFields: getInvitationSearchFields,
    debounceMs: 300,
    filters: { roleFilter },
    filterFn: invitationFilterFn
  })

  // Get current search values based on active tab
  const currentSearchQuery = activeTab === 'members' ? memberSearchQuery : invitationSearchQuery
  const setCurrentSearchQuery = activeTab === 'members' ? setMemberSearchQuery : setInvitationSearchQuery
  const isCurrentSearching = activeTab === 'members' ? isMemberSearching : isInvitationSearching
  const clearCurrentSearch = activeTab === 'members' ? clearMemberSearch : clearInvitationSearch
  const currentTotalCount = activeTab === 'members' ? memberTotalCount : invitationTotalCount
  const currentFilteredCount = activeTab === 'members' ? memberFilteredCount : invitationFilteredCount

  // Final filtered results
  const filteredMembers = searchFilteredMembers
  const filteredInvitations = searchFilteredInvitations

  const tabs = [
    { id: 'members' as const, label: 'Team Members', icon: Users, count: members.length },
    { id: 'invitations' as const, label: 'Invitations', icon: Mail, count: invitations.length }
  ]

  const roleLabels: Record<UserRole, { label: string; color: string; icon: React.ElementType }> = {
    SuperAdmin: { label: 'Super Admin', color: 'text-[#D417C8]', icon: Crown },
    Admin: { label: 'Admin', color: 'text-orange-400', icon: Shield },
    TeamManager: { label: 'Team Manager', color: 'text-blue-400', icon: Shield },
    TeamMember: { label: 'Team Member', color: 'text-green-400', icon: Users },
    Sales: { label: 'Sales', color: 'text-cyan-400', icon: Shield },
    Finance: { label: 'Finance', color: 'text-yellow-400', icon: Shield },
    Support: { label: 'Support', color: 'text-indigo-400', icon: Shield },
    Viewer: { label: 'Viewer', color: 'text-gray-400', icon: Users }
  }

  // Filter fields configuration
  const filterFields: FilterField[] = [
    {
      id: 'roleFilter',
      label: 'Role',
      type: 'custom',
      value: roleFilter,
      onChange: (value: string) => setRoleFilter(value as UserRole | 'all'),
      component: (
        <ApiDropdown
          config={teamRoleDropdownConfig}
          value={roleFilter === 'all' ? '' : roleFilter}
          onSelect={(value) => setRoleFilter(value as UserRole)}
          allowClear
          onClear={() => setRoleFilter('all')}
          className="w-full"
        />
      )
    }
  ]

  const handleInviteMember = async (email: string, role: UserRole): Promise<boolean> => {
    if (!roundAccountId) return false
    const success = await inviteMember(roundAccountId, email, role)
    if (success) {
      setShowInviteModal(false)
    }
    return success
  }

  const handleEditMember = (member: TeamMember) => {
    setSelectedMember(member)
    setShowEditModal(true)
  }

  const handleUpdateRole = async (userId: string, role: UserRole): Promise<boolean> => {
    if (roundAccountId) {
      const success = await updateMemberRole(roundAccountId, userId, role)
      if (success) {
        setShowEditModal(false)
        setSelectedMember(null)
      }
      return success
    }
    return false
  }

  const handleRemoveMember = (member: TeamMember) => {
    setSelectedMember(member)
    setShowConfirmDelete(true)
  }

  const confirmRemoveMember = async () => {
    if (selectedMember && roundAccountId) {
      const success = await removeMember(roundAccountId, selectedMember.id)
      if (success) {
        setShowConfirmDelete(false)
        setSelectedMember(null)
      }
    }
  }

  const handleResendInvitation = async (invitation: TeamInvitation) => {
    if (roundAccountId) {
      await resendInvitation(roundAccountId, invitation.id)
    }
  }

  const handleCancelInvitation = async (invitation: TeamInvitation) => {
    if (roundAccountId) {
      await cancelInvitation(roundAccountId, invitation.id)
    }
  }

  const handleSort = (field: string) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const sortedMembers = React.useMemo(() => {
    const sorted = [...filteredMembers]
    sorted.sort((a, b) => {
      let aValue: string | number = ''
      let bValue: string | number = ''

      switch (sortConfig.field) {
        case 'fullName':
          aValue = a.fullName || `${a.firstName} ${a.lastName}`
          bValue = b.fullName || `${b.firstName} ${b.lastName}`
          break
        case 'email':
          aValue = a.email
          bValue = b.email
          break
        case 'role':
          aValue = a.roleName || a.role
          bValue = b.roleName || b.role
          break
        case 'joinedAt':
          aValue = new Date(a.joinedAt).getTime()
          bValue = new Date(b.joinedAt).getTime()
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
    return sorted
  }, [filteredMembers, sortConfig])

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })

  const getInvitationStatus = (invitation: TeamInvitation) => {
    if (!invitation.expiresAt) {
      return { label: invitation.status, icon: Clock, color: 'text-yellow-400' }
    }
    
    const now = new Date()
    const expiryDate = new Date(invitation.expiresAt)
    
    if (expiryDate < now) {
      return { label: 'Expired', icon: XCircle, color: 'text-[#D417C8]' }
    }
    
    switch (invitation.status) {
      case 'Accepted':
        return { label: 'Accepted', icon: CheckCircle, color: 'text-green-400' }
      case 'Cancelled':
        return { label: 'Cancelled', icon: XCircle, color: 'text-[#D417C8]' }
      case 'Expired':
        return { label: 'Expired', icon: XCircle, color: 'text-[#D417C8]' }
      default:
        return { label: 'Pending', icon: Clock, color: 'text-yellow-400' }
    }
  }

  if (isLoading && members.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-pink-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading team data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Error Loading Team</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <ActionButton
            label="Retry"
            onClick={() => roundAccountId && refresh(roundAccountId)}
            variant="secondary"
            size="sm"
            actionType="general"
          />
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-medium text-white mb-4">
                Team{' '}
                <span className="text-primary">
                  Management
                </span>
              </h1>
              <p className="text-gray-500 dark:text-polar-500 leading-snug mb-3">
                Manage team members, roles, and invitations
              </p>
            </div>
            <ActionButton
              label="Invite Member"
              onClick={() => setShowInviteModal(true)}
              icon={UserPlus}
              variant="primary"
              size="md"
              actionType="create"
            />
          </div>
        </div>

      {/* Tabs */}
      <div>
        <Card padding="lg">
          <nav className="flex space-x-2">
            {tabs.map((tab) => {
              const IconComponent = tab.icon
              const isActive = activeTab === tab.id
              return (
                <Button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  variant={isActive ? 'primary' : 'ghost'}
                  size="md"
                  className={`space-x-2 ${isActive ? 'bg-primary/20 border-white/20' : ''}`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    isActive ? 'bg-white/20' : 'bg-white/10'
                  }`}>
                    {tab.count}
                  </span>
                </Button>
              )
            })}
            </nav>
          </Card>
        </div>

        {/* Search and Filters */}
        <SearchFilterToolbar
          searchQuery={currentSearchQuery}
          onSearchChange={setCurrentSearchQuery}
          searchPlaceholder={`Search ${activeTab} by ${activeTab === 'members' ? 'name, email, or role' : 'email or role'}...`}
          isSearching={isCurrentSearching}
          onClearSearch={clearCurrentSearch}
          searchResults={{
            total: currentTotalCount,
            filtered: currentFilteredCount
          }}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          filterFields={filterFields}
          className="mb-6"
        />

        {/* Content */}
        <Card padding="lg">
          {activeTab === 'members' ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-white">Team Members ({filteredMembers.length})</h2>
              </div>

              {filteredMembers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">
                    {currentSearchQuery || roleFilter !== 'all' ? 'No members found' : 'No team members yet'}
                  </h3>
                  <p className="text-gray-400 mb-6">
                    {currentSearchQuery || roleFilter !== 'all'
                      ? 'Try adjusting your search or filter criteria'
                      : 'Start building your team by inviting members'
                    }
                  </p>
                  {!currentSearchQuery && roleFilter === 'all' && (
                    <ActionButton
                      label="Invite First Member"
                      onClick={() => setShowInviteModal(true)}
                      icon={UserPlus}
                      variant="primary"
                      size="sm"
                    />
                  )}
                </div>
              ) : (
                <TeamMembersTable
                  members={sortedMembers}
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  onEditMember={handleEditMember}
                  onRemoveMember={handleRemoveMember}
                  loading={isLoading}
                />
              )}
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-white">Invitations ({filteredInvitations.length})</h2>
              </div>

              {filteredInvitations.length === 0 ? (
                <div className="text-center py-12">
                  <Mail className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">
                    {currentSearchQuery || roleFilter !== 'all' ? 'No invitations found' : 'No pending invitations'}
                  </h3>
                  <p className="text-gray-400 mb-6">
                    {currentSearchQuery || roleFilter !== 'all'
                      ? 'Try adjusting your search or filter criteria'
                      : 'All team members are already active'
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredInvitations.map((invitation) => {
                    const roleConfig = roleLabels[invitation.role] || roleLabels.TeamMember
                    const RoleIcon = roleConfig.icon
                    const status = getInvitationStatus(invitation)
                    const StatusIcon = status.icon
                    
                    return (
                      <motion.div
                        key={invitation.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                              <Mail className="w-6 h-6 text-gray-400" />
                            </div>
                            <div>
                              <h3 className="text-white font-medium">{invitation.email}</h3>
                              <div className="flex items-center space-x-4 mt-1">
                                <div className="flex items-center space-x-1">
                                  <RoleIcon className={`w-4 h-4 ${roleConfig.color}`} />
                                  <span className={`text-sm ${roleConfig.color}`}>
                                    {invitation.roleName || roleConfig.label}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <StatusIcon className={`w-4 h-4 ${status.color}`} />
                                  <span className={`text-sm ${status.color}`}>
                                    {status.label}
                                  </span>
                                </div>
                              </div>
                              {invitation.invitedByName && (
                                <p className="text-xs text-gray-400 mt-1">
                                  Invited by {invitation.invitedByName}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="text-xs text-gray-400">Invited</p>
                              <p className="text-sm text-white">{formatDate(invitation.invitedAt)}</p>
                              {invitation.expiresAt && (
                                <p className="text-xs text-gray-400 mt-1">
                                  Expires {formatDate(invitation.expiresAt)}
                                </p>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              {invitation.status === 'Pending' && (
                                <>
                                  <Button
                                    onClick={() => handleResendInvitation(invitation)}
                                    variant="ghost"
                                    size="sm"
                                    className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                                  >
                                    Resend
                                  </Button>
                                  <Button
                                    onClick={() => handleCancelInvitation(invitation)}
                                    variant="danger"
                                    size="sm"
                                    className="bg-red-500/20"
                                  >
                                    Cancel
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Modals */}
        {showInviteModal && (
          <InviteMemberModal
            isOpen={showInviteModal}
            onClose={() => setShowInviteModal(false)}
            onInvite={handleInviteMember}
          />
        )}

        {showEditModal && selectedMember && (
          <EditMemberModal
            isOpen={showEditModal}
            member={selectedMember}
            onClose={() => {
              setShowEditModal(false)
              setSelectedMember(null)
            }}
            onUpdateRole={handleUpdateRole}
          />
        )}
      </div>

      {/* Modals */}
      {showInviteModal && (
        <InviteMemberModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          onInvite={handleInviteMember}
        />
      )}

      {showEditModal && selectedMember && (
        <EditMemberModal
          isOpen={showEditModal}
          member={selectedMember}
          onClose={() => {
            setShowEditModal(false)
            setSelectedMember(null)
          }}
          onUpdateRole={handleUpdateRole}
        />
      )}

      {showConfirmDelete && selectedMember && (
        <ConfirmDialog
          isOpen={showConfirmDelete}
          onClose={() => {
            setShowConfirmDelete(false)
            setSelectedMember(null)
          }}
          onConfirm={confirmRemoveMember}
          title="Remove Team Member"
          message={`Are you sure you want to remove ${selectedMember.firstName} ${selectedMember.lastName} from the team? This action cannot be undone.`}
          confirmLabel="Remove Member"
          variant="danger"
        />
      )}
    </>
  )
}

export default TeamManagementPage

