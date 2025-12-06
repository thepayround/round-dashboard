import { Link } from 'react-router-dom'

import WhiteLogo from '@/assets/logos/white-logo.svg?url'

export const HomePage = () => (
  <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 gap-12">
    <div className="flex flex-col items-center gap-8 animate-in fade-in zoom-in-95 duration-1000">
      <img
        src={WhiteLogo}
        alt="Round Logo"
        className="h-24 w-24"
        loading="eager"
      />
      <div className="text-center">
        <h1 className="text-5xl font-medium text-foreground mb-4 tracking-tight">Round</h1>
        <p className="text-xl text-muted-foreground max-w-lg">Your billing and customer intelligence platform</p>
      </div>
    </div>
    <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
      <Link
        to="/login"
        className="bg-primary text-primary-foreground px-8 py-3 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        Sign In
      </Link>
      <Link
        to="/auth/register"
        className="border border-input bg-background px-8 py-3 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
      >
        Get Started
      </Link>
    </div>
  </div>
)
