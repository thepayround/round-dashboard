import { Users, MoreHorizontal, Mail, Shield, Trash2, UserPlus } from 'lucide-react'
import { useState } from 'react'

import { DashboardLayout } from '@/shared/layout/DashboardLayout'
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
    Badge,
    Card,
    PageHeader
} from '@/shared/ui'
import { Button, IconButton } from '@/shared/ui/Button'
import { SearchInput } from '@/shared/ui/SearchInput'

// Mock team member data
interface TeamMember {
    id: string
    name: string
    email: string
    role: 'owner' | 'admin' | 'member' | 'viewer'
    status: 'active' | 'pending' | 'inactive'
    joinedDate: string
    lastActive: string
}

const MOCK_TEAM_MEMBERS: TeamMember[] = [
    {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'owner',
        status: 'active',
        joinedDate: '2024-01-15',
        lastActive: '2 hours ago'
    },
    {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'admin',
        status: 'active',
        joinedDate: '2024-02-20',
        lastActive: '1 day ago'
    },
    {
        id: '3',
        name: 'Bob Johnson',
        email: 'bob@example.com',
        role: 'member',
        status: 'active',
        joinedDate: '2024-03-10',
        lastActive: '3 hours ago'
    },
    {
        id: '4',
        name: 'Alice Williams',
        email: 'alice@example.com',
        role: 'member',
        status: 'pending',
        joinedDate: '2024-11-20',
        lastActive: 'Never'
    }
]

export const TeamManagementPage = () => {
    const [searchQuery, setSearchQuery] = useState('')

    const filteredMembers = MOCK_TEAM_MEMBERS.filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const getRoleVariant = (role: string): 'primary' | 'neutral' | 'success' => {
        switch (role) {
            case 'owner': return 'primary'
            case 'admin': return 'success'
            case 'member': return 'neutral'
            default: return 'neutral'
        }
    }

    const getStatusVariant = (status: string): 'success' | 'warning' | 'neutral' => {
        switch (status) {
            case 'active': return 'success'
            case 'pending': return 'warning'
            default: return 'neutral'
        }
    }

    return (
        <DashboardLayout>
            <PageHeader
                title="Team Management"
                actions={
                    <Button
                        variant="primary"
                        size="md"
                        icon={UserPlus}
                        iconPosition="left"
                        onClick={() => {/* TODO: Implement invite member */}}
                    >
                        Invite Member
                    </Button>
                }
            />
            <div className="space-y-6">
                {/* Search */}
                <Card padding="md">
                    <SearchInput
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Search team members by name or email..."
                    />
                </Card>

                {/* Team Members Table */}
                <div className="border border-border/40 rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Member</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead>Last Active</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredMembers.map((member) => (
                                <TableRow
                                    key={member.id}
                                    className="group hover:bg-bg-raised/50 transition-colors"
                                >
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-bg-raised border border-border/50 flex items-center justify-center text-fg-muted group-hover:text-primary group-hover:border-primary/30 transition-colors">
                                                <Users className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-fg text-sm">{member.name}</div>
                                                <div className="text-xs text-fg-muted flex items-center gap-1.5">
                                                    <Mail className="w-3 h-3" />
                                                    {member.email}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={getRoleVariant(member.role)}
                                            size="md"
                                            className="capitalize"
                                        >
                                            <Shield className="w-3 h-3 mr-1" />
                                            {member.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={getStatusVariant(member.status)}
                                            size="md"
                                            className="capitalize"
                                        >
                                            {member.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm text-fg-muted">
                                            {new Date(member.joinedDate).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm text-fg-muted">
                                            {member.lastActive}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-end gap-2">
                                            {member.role !== 'owner' && (
                                                <>
                                                    <IconButton
                                                        icon={Shield}
                                                        variant="ghost"
                                                        size="sm"
                                                        aria-label="Change role"
                                                        className="text-fg-muted hover:text-fg"
                                                        onClick={() => {/* TODO: Implement change role */}}
                                                    />
                                                    <IconButton
                                                        icon={Trash2}
                                                        variant="ghost"
                                                        size="sm"
                                                        aria-label="Remove member"
                                                        className="text-fg-muted hover:text-destructive"
                                                        onClick={() => {/* TODO: Implement remove member */}}
                                                    />
                                                </>
                                            )}
                                            <IconButton
                                                icon={MoreHorizontal}
                                                variant="ghost"
                                                size="sm"
                                                aria-label="More actions"
                                                className="text-fg-muted hover:text-fg"
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Results count */}
                <div className="text-sm text-fg-muted">
                    Showing {filteredMembers.length} of {MOCK_TEAM_MEMBERS.length} team members
                </div>
            </div>
        </DashboardLayout>
    )
}
