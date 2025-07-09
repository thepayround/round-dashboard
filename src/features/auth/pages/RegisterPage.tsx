import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import type { AccountType } from '@/shared/types/auth'
import { AccountTypeSelector } from '../components/AccountTypeSelector'

export const RegisterPage = () => {
  const [selectedAccountType, setSelectedAccountType] = useState<AccountType | null>(null)
  const navigate = useNavigate()

  const handleAccountTypeSelect = (type: AccountType) => {
    setSelectedAccountType(type)
  }

  const handleContinue = () => {
    if (selectedAccountType === 'personal') {
      navigate('/auth/register/personal')
    } else if (selectedAccountType === 'business') {
      navigate('/auth/register/business')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <AccountTypeSelector
          selectedType={selectedAccountType}
          onTypeSelect={handleAccountTypeSelect}
          onContinue={handleContinue}
        />

        {/* Login Link */}
        <div className="text-center mt-8">
          <p className="auth-text-muted">
            Already have an account?{' '}
            <Link to="/auth/login" className="auth-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
