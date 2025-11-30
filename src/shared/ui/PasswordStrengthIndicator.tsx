import { Check, X } from 'lucide-react'
import { useMemo } from 'react'

interface PasswordRequirement {
  label: string
  test: (password: string) => boolean
}

interface PasswordStrengthIndicatorProps {
  password: string
  showStrengthBar?: boolean
  className?: string
}

const requirements: PasswordRequirement[] = [
  {
    label: 'At least 8 characters',
    test: (pwd) => pwd.length >= 8,
  },
  {
    label: 'One uppercase letter (A-Z)',
    test: (pwd) => /[A-Z]/.test(pwd),
  },
  {
    label: 'One lowercase letter (a-z)',
    test: (pwd) => /[a-z]/.test(pwd),
  },
  {
    label: 'One number (0-9)',
    test: (pwd) => /[0-9]/.test(pwd),
  },
  {
    label: 'One special character (!@#$%^&*)',
    test: (pwd) => /[^A-Za-z0-9]/.test(pwd),
  },
]

export const PasswordStrengthIndicator = ({
  password,
  showStrengthBar = true,
  className = '',
}: PasswordStrengthIndicatorProps) => {
  const strength = useMemo(() => {
    if (!password) return { score: 0, percentage: 0, label: '', color: '' }

    const metRequirements = requirements.filter((req) => req.test(password)).length
    const percentage = (metRequirements / requirements.length) * 100

    let label = ''
    let color = ''

    if (metRequirements === 0) {
      label = 'Very Weak'
      color = 'text-red-500'
    } else if (metRequirements <= 2) {
      label = 'Weak'
      color = 'text-orange-500'
    } else if (metRequirements <= 3) {
      label = 'Fair'
      color = 'text-yellow-500'
    } else if (metRequirements === 4) {
      label = 'Good'
      color = 'text-blue-500'
    } else {
      label = 'Strong'
      color = 'text-emerald-500'
    }

    return { score: metRequirements, percentage, label, color }
  }, [password])

  const isAllMet = useMemo(
    () => requirements.every((req) => req.test(password)),
    [password]
  )

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Strength Bar */}
      {showStrengthBar && password && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Password Strength</span>
            <span className={`font-normal ${strength.color}`}>{strength.label}</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                (() => {
                  if (strength.percentage === 100) return 'bg-emerald-500'
                  if (strength.percentage >= 80) return 'bg-blue-500'
                  if (strength.percentage >= 60) return 'bg-yellow-500'
                  if (strength.percentage >= 40) return 'bg-orange-500'
                  return 'bg-red-500'
                })()
              }`}
              style={{ width: `${strength.percentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Requirements Checklist */}
      <div className="space-y-1.5">
        <p className="text-xs font-normal text-muted-foreground">
          {isAllMet ? 'All requirements met!' : 'Password must contain:'}
        </p>
        <ul className="space-y-1">
          {requirements.map((requirement) => {
            const isMet = requirement.test(password)
            return (
              <li
                key={requirement.label}
                className={`flex items-center gap-2 text-xs transition-colors ${
                  isMet ? 'text-emerald-400' : 'text-muted-foreground'
                }`}
              >
                {isMet ? (
                  <Check className="w-3.5 h-3.5 flex-shrink-0" />
                ) : (
                  <X className="w-3.5 h-3.5 flex-shrink-0" />
                )}
                <span>{requirement.label}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
