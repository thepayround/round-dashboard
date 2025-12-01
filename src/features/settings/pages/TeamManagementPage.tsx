import { Users, MoreHorizontal, Mail, Shield, Trash2, UserPlus, AlertTriangle, Search } from 'lucide-react'
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
    Input,
    Label,
    Button
} from '@/shared/ui'
import { SimpleSelect } from '@/shared/ui/SimpleSelect'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,
    AlertDialogCancel
} from '@/shared/ui/shadcn/alert-dialog'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/shared/ui/shadcn/dialog'

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

const INITIAL_TEAM_MEMBERS: TeamMember[] = [
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
    const [members, setMembers] = useState<TeamMember[]>(INITIAL_TEAM_MEMBERS)

    // Modal states
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
    const [memberToEdit, setMemberToEdit] = useState<TeamMember | null>(null)
    const [memberToRemove, setMemberToRemove] = useState<TeamMember | null>(null)

    // Form states
    const [inviteEmail, setInviteEmail] = useState('')
    const [inviteRole, setInviteRole] = useState('member')
    const [newRole, setNewRole] = useState('')

    const filteredMembers = members.filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const getRoleVariant = (role: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
        switch (role) {
            case 'owner': return 'default'
            case 'admin': return 'secondary'
            case 'member': return 'outline'
            default: return 'outline'
        }
    }

    const getStatusVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
        switch (status) {
            case 'active': return 'default'
            case 'pending': return 'secondary'
            default: return 'outline'
        }
    }

    const handleInviteMember = () => {
        if (!inviteEmail) return

        const newMember: TeamMember = {
            id: Math.random().toString(36).substr(2, 9),
            name: inviteEmail.split('@')[0], // Simple name extraction
            email: inviteEmail,
            role: inviteRole as TeamMember['role'],
            status: 'pending',
            joinedDate: new Date().toISOString(),
            lastActive: 'Never'
        }

        setMembers([...members, newMember])
        setIsInviteModalOpen(false)
        setInviteEmail('')
        setInviteRole('member')
    }

    const handleChangeRole = () => {
        if (!memberToEdit || !newRole) return

        setMembers(members.map(m =>
            m.id === memberToEdit.id
                ? { ...m, role: newRole as TeamMember['role'] }
                : m
        ))
        setMemberToEdit(null)
        setNewRole('')
    }

    const handleRemoveMember = () => {
        if (!memberToRemove) return

        setMembers(members.filter(m => m.id !== memberToRemove.id))
        setMemberToRemove(null)
    }

    return (
        <DashboardLayout>
            {/* Inline Page Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold tracking-tight">Team Management</h1>
                <Button
                    variant="default"
                    size="default"
                    onClick={() => setIsInviteModalOpen(true)}
                >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Invite Member
                </Button>
            </div>

            <div className="space-y-6">
                {/* Search */}
                <Card className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search team members by name or email..."
                            className="pl-9"
                        />
                    </div>
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
                                            className="capitalize"
                                        >
                                            <Shield className="w-3 h-3 mr-1" />
                                            {member.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={getStatusVariant(member.status)}
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
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        aria-label="Change role"
                                                        className="h-8 w-8 text-fg-muted hover:text-fg"
                                                        onClick={() => {
                                                            setMemberToEdit(member)
                                                            setNewRole(member.role)
                                                        }}
                                                    >
                                                        <Shield className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        aria-label="Remove member"
                                                        className="h-8 w-8 text-fg-muted hover:text-destructive"
                                                        onClick={() => setMemberToRemove(member)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                aria-label="More actions"
                                                className="h-8 w-8 text-fg-muted hover:text-fg"
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Results count */}
                <div className="text-sm text-fg-muted">
                    Showing {filteredMembers.length} of {members.length} team members
                </div>

                {/* Invite Member Dialog */}
                <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Invite Team Member</DialogTitle>
                            <DialogDescription>
                                Send an invitation to join your team.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    placeholder="colleague@company.com"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    type="email"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <SimpleSelect
                                    id="role"
                                    options={[
                                        { value: 'admin', label: 'Admin' },
                                        { value: 'member', label: 'Member' },
                                        { value: 'viewer', label: 'Viewer' }
                                    ]}
                                    value={inviteRole}
                                    onChange={setInviteRole}
                                    placeholder="Select a role"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsInviteModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="default"
                                onClick={handleInviteMember}
                                disabled={!inviteEmail}
                            >
                                Send Invite
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Change Role Dialog */}
                <Dialog open={!!memberToEdit} onOpenChange={(open) => !open && setMemberToEdit(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Change Member Role</DialogTitle>
                            <DialogDescription>
                                Update role for {memberToEdit?.name}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="new-role">Role</Label>
                                <SimpleSelect
                                    id="new-role"
                                    options={[
                                        { value: 'admin', label: 'Admin' },
                                        { value: 'member', label: 'Member' },
                                        { value: 'viewer', label: 'Viewer' }
                                    ]}
                                    value={newRole}
                                    onChange={setNewRole}
                                    placeholder="Select a role"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setMemberToEdit(null)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="default"
                                onClick={handleChangeRole}
                            >
                                Update Role
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Remove Member Dialog */}
                <AlertDialog open={!!memberToRemove} onOpenChange={(open) => !open && setMemberToRemove(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-destructive" />
                                <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
                            </div>
                            <AlertDialogDescription>
                                Are you sure you want to remove {memberToRemove?.name} from the team? This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setMemberToRemove(null)}>
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleRemoveMember}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                Remove Member
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </DashboardLayout>
    )
}
