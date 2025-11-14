import { useCallback, useEffect, useMemo, useState } from 'react'

import type { TeamInvitation, TeamMember, UserRole } from '../types/team.types'

import { useTeamManagement } from './useTeamManagement'

import { useGlobalToast } from '@/shared/contexts/ToastContext'
import {
  useDebouncedSearch,
  type UseDebouncedSearchReturn,
} from '@/shared/hooks/useDebouncedSearch'
import { useRoundAccount } from '@/shared/hooks/useRoundAccount'
import { teamRoleDropdownConfig } from '@/shared/ui/ApiDropdown'
import type { FilterField } from '@/shared/widgets/SearchFilterToolbar'


const ROLE_FILTER_FALLBACKS: Array<{ value: UserRole; label: string; description: string }> = [
  { value: 'SuperAdmin', label: 'Super Admin', description: 'Full workspace control' },
  { value: 'Admin', label: 'Admin', description: 'Manage members and settings' },
  { value: 'TeamManager', label: 'Team Manager', description: 'Oversees team members' },
  { value: 'TeamMember', label: 'Team Member', description: 'Standard collaboration access' },
  { value: 'Sales', label: 'Sales', description: 'Sales pipeline access' },
  { value: 'Finance', label: 'Finance', description: 'Billing & payments access' },
  { value: 'Support', label: 'Support', description: 'Customer support tooling' },
  { value: 'Viewer', label: 'Viewer', description: 'Read-only access' },
]

export interface UseTeamManagementControllerReturn {
  activeTab: 'members' | 'invitations'
  setActiveTab: (tab: 'members' | 'invitations') => void
  roleFilter: UserRole | 'all'
  filterFields: FilterField[]
  membersCount: { total: number; filtered: number }
  invitationsCount: { total: number; filtered: number }
  showFilters: boolean
  toggleFilters: () => void
  showInviteModal: boolean
  openInviteModal: () => void
  closeInviteModal: () => void
  showEditModal: boolean
  openEditModal: (member: TeamMember) => void
  closeEditModal: () => void
  showDeleteConfirm: boolean
  openDeleteConfirm: (member: TeamMember) => void
  closeDeleteConfirm: () => void
  selectedMember: TeamMember | null
  isLoading: boolean
  error: string | null
  memberSearch: UseDebouncedSearchReturn<TeamMember>
  invitationSearch: UseDebouncedSearchReturn<TeamInvitation>
  handleInviteMember: (email: string, role: UserRole) => Promise<boolean>
  handleUpdateRole: (memberId: string, role: UserRole) => Promise<boolean>
  handleRemoveMember: () => Promise<boolean>
  handleResendInvitation: (invitation: TeamInvitation) => Promise<void>
  handleCancelInvitation: (invitation: TeamInvitation) => Promise<void>
  refreshTeam: () => void
  formatDate: (value: string) => string
  sortConfig: { field: string; direction: 'asc' | 'desc' }
  handleSort: (field: string) => void
  sortedMembers: TeamMember[]
}

export const useTeamManagementController = (): UseTeamManagementControllerReturn => {
  const { roundAccount } = useRoundAccount()
  const roundAccountId = roundAccount?.roundAccountId ?? ''
  const { showError, showSuccess } = useGlobalToast()

  const [activeTab, setActiveTab] = useState<'members' | 'invitations'>('members')
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [sortConfig, setSortConfig] = useState<{ field: string; direction: 'asc' | 'desc' }>({
    field: 'fullName',
    direction: 'asc',
  })

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
    refresh,
  } = useTeamManagement()

  const loadTeam = useCallback(() => {
    if (roundAccountId) {
      refresh(roundAccountId)
    }
  }, [refresh, roundAccountId])

  useEffect(() => {
    loadTeam()
  }, [loadTeam])

  const memberSearchFields = useCallback(
    (member: TeamMember) => [
      member.firstName ?? '',
      member.lastName ?? '',
      member.fullName ?? '',
      member.email ?? '',
      member.roleName ?? '',
    ],
    []
  )

  const invitationSearchFields = useCallback(
    (invitation: TeamInvitation) => [invitation.email ?? '', invitation.roleName ?? '', invitation.invitedByName ?? ''],
    []
  )

  const roleFilterOptions = useMemo(
    () => [
      { id: 'all', name: 'All Roles', value: 'all' },
      ...teamRoleDropdownConfig.mapToOptions(ROLE_FILTER_FALLBACKS).map(option => ({
        id: option.value,
        name: option.label,
        value: option.value,
      })),
    ],
    []
  )

  const memberFilterFn = useCallback(
    (member: TeamMember, filters: { roleFilter?: UserRole | 'all' }) => {
      if (filters.roleFilter && filters.roleFilter !== 'all') {
        return member.role === filters.roleFilter
      }
      return true
    },
    []
  )

  const invitationFilterFn = useCallback(
    (invitation: TeamInvitation, filters: { roleFilter?: UserRole | 'all' }) => {
      if (filters.roleFilter && filters.roleFilter !== 'all') {
        return invitation.role === filters.roleFilter
      }
      return true
    },
    []
  )

  const memberSearch = useDebouncedSearch<TeamMember>({
    items: members,
    searchFields: memberSearchFields,
    debounceMs: 300,
    filters: { roleFilter },
    filterFn: memberFilterFn,
  })

  const invitationSearch = useDebouncedSearch<TeamInvitation>({
    items: invitations,
    searchFields: invitationSearchFields,
    debounceMs: 300,
    filters: { roleFilter },
    filterFn: invitationFilterFn,
  })

  const filterFields: FilterField[] = useMemo(
    () => [
      {
        id: 'roleFilter',
        label: 'Role',
        type: 'select',
        value: roleFilter,
        onChange: (value: string) => setRoleFilter((value || 'all') as UserRole | 'all'),
        onClear: () => setRoleFilter('all'),
        options: roleFilterOptions,
        placeholder: 'Filter by role',
      },
    ],
    [roleFilter, roleFilterOptions]
  )

  const membersCount = useMemo(
    () => ({ total: memberSearch.totalCount, filtered: memberSearch.filteredCount }),
    [memberSearch.filteredCount, memberSearch.totalCount]
  )

  const invitationsCount = useMemo(
    () => ({ total: invitationSearch.totalCount, filtered: invitationSearch.filteredCount }),
    [invitationSearch.filteredCount, invitationSearch.totalCount]
  )

  const handleInviteMember = useCallback(
    async (email: string, role: UserRole) => {
      if (!roundAccountId) {
        showError('Round account not found')
        return false
      }
      const success = await inviteMember(roundAccountId, email, role)
      if (success) {
        showSuccess('Invitation sent successfully')
        setShowInviteModal(false)
      }
      return success
    },
    [inviteMember, roundAccountId, showError, showSuccess]
  )

  const handleUpdateRole = useCallback(
    async (memberId: string, role: UserRole) => {
      if (!roundAccountId) {
        showError('Round account not found')
        return false
      }
      const success = await updateMemberRole(roundAccountId, memberId, role)
      if (success) {
        showSuccess('Member role updated')
        setShowEditModal(false)
        setSelectedMember(null)
      }
      return success
    },
    [roundAccountId, showError, showSuccess, updateMemberRole]
  )

  const handleRemoveMember = useCallback(async () => {
    if (!roundAccountId || !selectedMember) {
      showError('Select a member to remove')
      return false
    }
    const success = await removeMember(roundAccountId, selectedMember.id)
    if (success) {
      showSuccess('Team member removed')
      setShowDeleteConfirm(false)
      setSelectedMember(null)
    }
    return success
  }, [removeMember, roundAccountId, selectedMember, showError, showSuccess])

  const handleResendInvitation = useCallback(
    async (invitation: TeamInvitation) => {
      if (!roundAccountId) {
        showError('Round account not found')
        return
      }
      const success = await resendInvitation(roundAccountId, invitation.id)
      if (success) {
        showSuccess('Invitation resent')
      }
    },
    [resendInvitation, roundAccountId, showError, showSuccess]
  )

  const handleCancelInvitation = useCallback(
    async (invitation: TeamInvitation) => {
      if (!roundAccountId) {
        showError('Round account not found')
        return
      }
      const success = await cancelInvitation(roundAccountId, invitation.id)
      if (success) {
        showSuccess('Invitation cancelled')
      }
    },
    [cancelInvitation, roundAccountId, showError, showSuccess]
  )

  const formatDate = useCallback((value: string) => {
    try {
      return new Date(value).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch {
      return value
    }
  }, [])

  const sortedMembers = useMemo(() => {
    const sorted = [...memberSearch.filteredItems]
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
  }, [memberSearch.filteredItems, sortConfig])

  const handleSort = useCallback(
    (field: string) => {
      setSortConfig(prev => ({
        field,
        direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
      }))
    },
    []
  )

  return {
    activeTab,
    setActiveTab,
    roleFilter,
    filterFields,
    membersCount,
    invitationsCount,
    showFilters,
    toggleFilters: () => setShowFilters(prev => !prev),
    showInviteModal,
    openInviteModal: () => setShowInviteModal(true),
    closeInviteModal: () => setShowInviteModal(false),
    showEditModal,
    openEditModal: member => {
      setSelectedMember(member)
      setShowEditModal(true)
    },
    closeEditModal: () => {
      setShowEditModal(false)
      setSelectedMember(null)
    },
    showDeleteConfirm,
    openDeleteConfirm: member => {
      setSelectedMember(member)
      setShowDeleteConfirm(true)
    },
    closeDeleteConfirm: () => {
      setSelectedMember(null)
      setShowDeleteConfirm(false)
    },
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
    refreshTeam: loadTeam,
    formatDate,
    sortConfig,
    handleSort,
    sortedMembers,
  }
}
