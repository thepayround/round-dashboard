import { Link, useNavigate } from 'react-router-dom'

import { AccountTypeSelector } from '../components/AccountTypeSelector'

import type { AccountType } from '@/shared/types/auth'

export const RegisterPage = () => {
  const navigate = useNavigate()

  const handleAccountTypeSelect = (type: AccountType) => {
    if (type === 'personal') {
      navigate('/identities/register')
    } else if (type === 'business') {
      navigate('/identities/register-business')
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center pb-12 z-[1]">
      {/* Background Layer */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Sophisticated floating elements */}
        <div className="absolute top-20 left-20 w-48 h-48 bg-primary/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-32 right-32 w-36 h-36 bg-primary/15 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/3 w-28 h-28 bg-primary/12 rounded-full blur-2xl animate-pulse delay-500" />
        <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-primary/12 rounded-full blur-2xl animate-pulse delay-700" />
        <div className="absolute top-3/4 right-1/4 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse delay-300" />
      </div>

      <div className="relative z-10 w-full max-w-6xl">
        <AccountTypeSelector
          selectedType={null}
          onTypeSelect={handleAccountTypeSelect}
          onContinue={() => {}}
        />

        {/* Login Link with sophisticated styling */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-4 px-8 py-4 bg-white/8 rounded-lg border border-white/15 shadow-2xl">
            <span className="text-white/85 text-base font-medium">Already have an account?</span>
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-2 text-white font-normal tracking-tight rounded-lg bg-white/10 border border-white/20 transition-all duration-300 hover:bg-white/15 hover:border-white/30 hover:shadow-lg hover:shadow-secondary/10"
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
