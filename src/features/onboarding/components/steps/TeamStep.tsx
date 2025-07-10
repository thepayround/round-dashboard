import { motion } from 'framer-motion'
import { Users, UserPlus, Mail, Trash2, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import type { TeamSettings } from '../../types/onboarding'

interface TeamStepProps {
  data: TeamSettings
  onChange: (data: TeamSettings) => void
}

export const TeamStep = ({ data, onChange }: TeamStepProps) => {
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('member')

  const handleInviteTeamMember = () => {
    if (inviteEmail.trim()) {
      const newInvitation = {
        id: Date.now().toString(),
        email: inviteEmail.trim(),
        role: inviteRole,
        status: 'pending' as const,
      }

      onChange({
        ...data,
        invitations: [...data.invitations, newInvitation],
      })

      setInviteEmail('')
      setInviteRole('member')
    }
  }

  const handleRemoveInvitation = (id: string) => {
    onChange({
      ...data,
      invitations: data.invitations.filter(inv => inv.id !== id),
    })
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-[#D417C8]/20 text-[#D417C8] border-[#D417C8]/30'
      case 'manager':
        return 'bg-[#7767DA]/20 text-[#7767DA] border-[#7767DA]/30'
      case 'member':
        return 'bg-[#14BDEA]/20 text-[#14BDEA] border-[#14BDEA]/30'
      default:
        return 'bg-gray-400/20 text-gray-400 border-gray-400/30'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#32A1E4]/20 to-[#14BDEA]/20 backdrop-blur-sm border border-white/20 flex items-center justify-center"
        >
          <Users className="w-8 h-8 text-[#32A1E4]" />
        </motion.div>

        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Team</h2>
          <p className="text-gray-400 text-lg">Invite your team members</p>
        </div>
      </div>

      {/* Invite Team Members Section */}
      <div className="space-y-6">
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <UserPlus className="w-6 h-6 text-[#32A1E4]" />
              <h3 className="text-lg font-semibold text-white">Invite Team Members</h3>
            </div>

            {/* Invite Form */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label
                    htmlFor="inviteEmail"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="inviteEmail"
                      type="email"
                      value={inviteEmail}
                      onChange={e => setInviteEmail(e.target.value)}
                      placeholder="colleague@example.com"
                      className="w-full h-12 pl-12 pr-4 rounded-xl backdrop-blur-xl border transition-all duration-200 bg-white/5 border-white/10 text-white placeholder-gray-400 focus:bg-white/10 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-[#D417C8]/30"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="inviteRole"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Role
                  </label>
                  <select
                    id="inviteRole"
                    value={inviteRole}
                    onChange={e => setInviteRole(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl backdrop-blur-xl border transition-all duration-200 bg-white/5 border-white/10 text-white focus:bg-white/10 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-[#D417C8]/30"
                  >
                    <option value="member">Member</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleInviteTeamMember}
                disabled={!inviteEmail.trim()}
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#D417C8] to-[#14BDEA] text-white font-medium hover:shadow-lg hover:shadow-[#D417C8]/30 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed"
              >
                <UserPlus className="w-5 h-5" />
                <span>Send Invitation</span>
              </button>
            </div>
          </div>
        </div>

        {/* Invited Members List */}
        {data.invitations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-medium text-white">Pending Invitations</h4>
            <div className="space-y-3">
              {data.invitations.map(invitation => (
                <motion.div
                  key={invitation.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D417C8]/20 to-[#14BDEA]/20 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-[#32A1E4]" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{invitation.email}</p>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full border ${getRoleBadgeColor(invitation.role)}`}
                          >
                            {invitation.role}
                          </span>
                          <span className="text-xs text-gray-400">Status: {invitation.status}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveInvitation(invitation.id)}
                      className="p-2 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Success Message */}
        {data.invitations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-xl bg-gradient-to-r from-[#42E695]/10 to-[#3BB2B8]/10 border border-[#42E695]/20"
          >
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-[#42E695]" />
              <p className="text-[#42E695] text-sm font-medium">
                {data.invitations.length} team member{data.invitations.length !== 1 ? 's' : ''}{' '}
                invited successfully
              </p>
            </div>
          </motion.div>
        )}

        {/* Skip Option */}
        <div className="text-center">
          <p className="text-sm text-gray-400">
            You can invite team members later from your team management page
          </p>
        </div>
      </div>
    </motion.div>
  )
}
