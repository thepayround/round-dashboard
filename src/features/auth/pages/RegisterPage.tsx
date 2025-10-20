import {} from 'react'
import { Link, useNavigate } from 'react-router-dom'

import type { AccountType } from '@/shared/types/auth'
import { AccountTypeSelector } from '../components/AccountTypeSelector'

export const RegisterPage = () => {
  const navigate = useNavigate()

  const handleAccountTypeSelect = (type: AccountType) => {
    if (type === 'personal') {
      navigate('/auth/register/personal')
    } else if (type === 'business') {
      navigate('/auth/register/business')
    }
  }

  return (
    <div className="auth-container">
      {/* Background Layer */}
      <div className="auth-background">
        {/* Sophisticated floating elements */}
        <div className="absolute top-20 left-20 w-48 h-48 bg-gradient-to-br from-[#D417C8]/15 to-[#7767DA]/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-32 right-32 w-36 h-36 bg-gradient-to-br from-[#14BDEA]/15 to-[#7767DA]/15 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/3 w-28 h-28 bg-gradient-to-br from-[#7767DA]/12 to-[#D417C8]/12 rounded-full blur-2xl animate-pulse delay-500" />
        <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-gradient-to-br from-[#14BDEA]/12 to-[#32A1E4]/12 rounded-full blur-2xl animate-pulse delay-700" />
        <div className="absolute top-3/4 right-1/4 w-20 h-20 bg-gradient-to-br from-[#BD2CD0]/10 to-[#7767DA]/10 rounded-full blur-xl animate-pulse delay-300" />
      </div>

      <div className="relative z-10 w-full max-w-6xl">
        <AccountTypeSelector
          selectedType={null}
          onTypeSelect={handleAccountTypeSelect}
          onContinue={() => {}}
        />

        {/* Login Link with sophisticated styling */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-4 px-8 py-4 bg-white/8 backdrop-blur-xl rounded-lg border border-white/15 shadow-2xl">
            <span className="text-white/85 text-base font-medium">Already have an account?</span>
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-2 text-white font-normal tracking-tight rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-300 hover:bg-white/15 hover:border-white/30 hover:shadow-lg hover:shadow-[#14BDEA]/10 brand-primary"
              aria-label="Sign in to your existing account"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
