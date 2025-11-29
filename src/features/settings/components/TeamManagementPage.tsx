import { motion } from 'framer-motion'
import {
  Users,
  UserPlus,
  Mail,
  Shield,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Crown
} from 'lucide-react'
import React from 'react'

import { EditMemberModal } from '../components/EditMemberModal'
import { InviteMemberModal } from '../components/InviteMemberModal'
import TeamMembersTable from '../components/TeamMembersTable'
import { useTeamManagementController } from '../hooks/useTeamManagementController'
import type { TeamInvitation, UserRole } from '../types/team.types'

import { LoadingSpinner } from '@/shared/ui/LoadingSpinner'
import { Badge } from '@/shared/ui/shadcn/badge'
import { Button } from '@/shared/ui/shadcn/button'
import { Card } from '@/shared/ui/shadcn/card'
import { ConfirmDialog } from '@/shared/widgets/ConfirmDialog'
import { SearchFilterToolbar } from '@/shared/widgets/SearchFilterToolbar'




export const TeamManagementPage: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    roleFilter,
    filterFields,
    membersCount,
    invitationsCount,
    showFilters,
    toggleFilters,
    showInviteModal,
    openInviteModal,
    closeInviteModal,
    showEditModal,
    openEditModal,
    closeEditModal,
    showDeleteConfirm,
    openDeleteConfirm,
    closeDeleteConfirm,
    selectedMember,
    isLoading,
    error,
    memberSearch,
    invitationSearch,
    handleInviteMember,
    handleUpdateRole,
    handleRemoveMember,
    handleResendInvitation,
    handleCancelInvitation,
    refreshTeam,
    formatDate,
    sortConfig,
    handleSort,
    sortedMembers,
  } = useTeamManagementController()

  const {
    searchQuery: memberSearchQuery,
    setSearchQuery: setMemberSearchQuery,
    filteredItems: filteredMembers,
    isSearching: isMemberSearching,
    clearSearch: clearMemberSearch,
    totalCount: memberTotalCount,
    filteredCount: memberFilteredCount,
  } = memberSearch

  const {
    searchQuery: invitationSearchQuery,
    setSearchQuery: setInvitationSearchQuery,
    filteredItems: filteredInvitations,
    isSearching: isInvitationSearching,
    clearSearch: clearInvitationSearch,
    totalCount: invitationTotalCount,
    filteredCount: invitationFilteredCount,
  } = invitationSearch

  const currentSearchQuery = activeTab === 'members' ? memberSearchQuery : invitationSearchQuery
  const setCurrentSearchQuery = activeTab === 'members' ? setMemberSearchQuery : setInvitationSearchQuery
  const isCurrentSearching = activeTab === 'members' ? isMemberSearching : isInvitationSearching
  const clearCurrentSearch = activeTab === 'members' ? clearMemberSearch : clearInvitationSearch
  const currentTotalCount = activeTab === 'members' ? memberTotalCount : invitationTotalCount
  const currentFilteredCount = activeTab === 'members' ? memberFilteredCount : invitationFilteredCount

  const tabs = [
    { id: 'members' as const, label: 'Team Members', icon: Users, count: membersCount.total },
    { id: 'invitations' as const, label: 'Invitations', icon: Mail, count: invitationsCount.total },
  ]

  const roleLabels: Record<UserRole, { label: string; color: string; icon: React.ElementType }> = {
    SuperAdmin: { label: 'Super Admin', color: 'text-primary', icon: Crown },
    Admin: { label: 'Admin', color: 'text-orange-400', icon: Shield },
    TeamManager: { label: 'Team Manager', color: 'text-blue-400', icon: Shield },
    TeamMember: { label: 'Team Member', color: 'text-success', icon: Users },
    Sales: { label: 'Sales', color: 'text-cyan-400', icon: Shield },
    Finance: { label: 'Finance', color: 'text-yellow-400', icon: Shield },
    Support: { label: 'Support', color: 'text-indigo-400', icon: Shield },
    Viewer: { label: 'Viewer', color: 'text-gray-400', icon: Users }
  }

  const getInvitationStatus = (invitation: TeamInvitation) => {
    if (!invitation.expiresAt) {
      return { label: invitation.status, icon: Clock, color: 'text-yellow-400' }
    }
    
    const now = new Date()
    const expiryDate = new Date(invitation.expiresAt)
    
    if (expiryDate < now) {
      return { label: 'Expired', icon: XCircle, color: 'text-primary' }
    }
    
    switch (invitation.status) {
      case 'Accepted':
        return { label: 'Accepted', icon: CheckCircle, color: 'text-success' }
      case 'Cancelled':
        return { label: 'Cancelled', icon: XCircle, color: 'text-primary' }
      case 'Expired':
        return { label: 'Expired', icon: XCircle, color: 'text-primary' }
      default:
        return { label: 'Pending', icon: Clock, color: 'text-yellow-400' }
    }
  }

  if (isLoading && membersCount.total === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-white/70 mt-4">Loading team data...</p>
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
          <Button
            onClick={refreshTeam}
            variant="secondary"
          >
            Retry
          </Button>
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
              <p className="text-gray-500 dark:text-polar-500 leading-snug mb-4">
                Manage team members, roles, and invitations
              </p>
            </div>
            <Button
              onClick={openInviteModal}
              variant="default"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Member
            </Button>
          </div>
        </div>

      {/* Tabs */}
      <div>
        <Card className="p-6">
          <nav className="flex space-x-2">
            {tabs.map((tab) => {
              const IconComponent = tab.icon
              const isActive = activeTab === tab.id
              return (
                <Button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  variant={isActive ? 'default' : 'ghost'}
                  className={`space-x-2 ${isActive ? 'bg-primary/20 border-white/20' : ''}`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                  <Badge variant="outline">
                    {tab.count}
                  </Badge>
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
          onToggleFilters={toggleFilters}
          filterFields={filterFields}
          className="mb-6"
        />

        {/* Content */}
        <Card className="p-6">
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
                    <Button
                      onClick={openInviteModal}
                      variant="default"
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      Invite First Member
                    </Button>
                  )}
                </div>
              ) : (
                <TeamMembersTable
                  members={sortedMembers}
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  onEditMember={openEditModal}
                  onRemoveMember={openDeleteConfirm}
                  isLoading={isLoading}
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
                        className="p-4 bg-white/5 border border-border rounded-lg hover:bg-white/10 transition-all duration-200"
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
                                    variant="destructive"
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
            onClose={closeInviteModal}
            onInvite={handleInviteMember}
          />
        )}

        {showEditModal && selectedMember && (
          <EditMemberModal
            isOpen={showEditModal}
            member={selectedMember}
            onClose={closeEditModal}
            onUpdateRole={handleUpdateRole}
          />
        )}
      </div>

      {showDeleteConfirm && selectedMember && (
        <ConfirmDialog
          isOpen={showDeleteConfirm}
          onClose={closeDeleteConfirm}
          onConfirm={async () => {
            await handleRemoveMember()
          }}
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

