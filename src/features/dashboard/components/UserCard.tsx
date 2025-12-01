import { User } from 'lucide-react'

import { Badge } from '@/shared/ui/shadcn/badge'

export interface AccountUserData {
  roundAccountId: string
  userId: string
  role?: string
}

interface UserCardProps {
  user: AccountUserData
}

/**
 * UserCard - Displays a user with their role badge
 * Uses consistent foreground colors for visibility in dark theme
 */
export const UserCard = ({ user }: UserCardProps) => {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 transition-colors">
      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 border border-border">
        <User className="w-4 h-4 text-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <p className="text-xs font-medium text-muted-foreground">User ID</p>
          {user.role && (
            <Badge
              variant="outline"
              className="text-[10px] uppercase tracking-wider font-medium"
            >
              {user.role}
            </Badge>
          )}
        </div>
        <p
          className="text-sm font-mono text-foreground truncate"
          title={user.userId}
        >
          {user.userId}
        </p>
      </div>
    </div>
  )
}
