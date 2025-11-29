import { AlertCircle } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import { GoogleLoginButton } from '../components/GoogleLoginButton'
import { usePersonalRegisterController } from '../hooks/usePersonalRegisterController'

import { useGlobalToast } from '@/shared/contexts/ToastContext'
import { PasswordStrengthIndicator } from '@/shared/ui/PasswordStrengthIndicator'
import { PhoneInput } from '@/shared/ui/PhoneInput'
import { Button } from '@/shared/ui/shadcn/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/shadcn/card'
import { Input } from '@/shared/ui/shadcn/input'
import { Label } from '@/shared/ui/shadcn/label'
import { PasswordInput } from '@/shared/ui/shadcn/password-input'

export const PersonalRegisterPage = () => {
  const navigate = useNavigate()
  const { showSuccess, showError } = useGlobalToast()
  const {
    form,
    phone,
    isSubmitting,
    handleSubmit,
    isFormReady,
  } = usePersonalRegisterController()

  const { values, errors, handleChange, handleBlur } = form
  const { phoneData, phoneError, handlePhoneChange, handlePhoneBlur } = phone

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Personal Account</CardTitle>
        <CardDescription>Join the Round community</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-8">
            {/* Name Fields Row */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">
                  First Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={values.firstName}
                  onChange={handleChange('firstName')}
                  onBlur={handleBlur('firstName')}
                  placeholder="John"
                  aria-invalid={!!errors.firstName}
                  autoComplete="given-name"
                  required
                />
                {errors.firstName && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="lastName">
                  Last Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={values.lastName}
                  onChange={handleChange('lastName')}
                  onBlur={handleBlur('lastName')}
                  placeholder="Doe"
                  aria-invalid={!!errors.lastName}
                  autoComplete="family-name"
                  required
                />
                {errors.lastName && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* Email Address */}
            <div className="grid gap-2">
              <Label htmlFor="email">
                Email Address <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange('email')}
                onBlur={handleBlur('email')}
                placeholder="email@example.com"
                aria-invalid={!!errors.email}
                autoComplete="email"
                required
              />
              {errors.email && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div className="grid gap-2">
              <PhoneInput
                id="phone"
                name="phone"
                value={phoneData.phone}
                onChange={handlePhoneChange}
                onBlur={handlePhoneBlur}
                validateOnBlur={false}
                label="Phone Number"
                placeholder="Phone number"
                error={phoneError}
                defaultCountry="GR"
                showValidation={false}
              />
              {phoneError && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {phoneError}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="grid gap-2">
              <Label htmlFor="password">
                Password <span className="text-destructive">*</span>
              </Label>
              <PasswordInput
                id="password"
                name="password"
                value={values.password}
                onChange={handleChange('password')}
                onBlur={handleBlur('password')}
                placeholder="Create a strong password"
                aria-invalid={!!errors.password}
                autoComplete="new-password"
                required
              />
              {errors.password && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.password}
                </p>
              )}

              {/* Password Strength Indicator */}
              {values.password && (
                <div className="mt-2">
                  <PasswordStrengthIndicator
                    password={values.password}
                    showStrengthBar
                  />
                </div>
              )}
            </div>

            {/* Terms and Conditions */}
            <p className="text-sm text-muted-foreground text-center">
              By creating an account you accept Round&apos;s{' '}
              <Link to="/terms" className="text-primary underline-offset-4 hover:underline">
                terms and conditions
              </Link>
            </p>

            {/* Submit Button */}
            <div className="flex flex-col gap-4">
              <Button
                type="submit"
                disabled={!isFormReady || isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'Creating Account...' : 'Create Personal Account'}
              </Button>

              <GoogleLoginButton
                accountType="personal"
                onSuccess={() => {
                  showSuccess('Successfully registered with Google!')
                  navigate('/dashboard')
                }}
                onError={(error) => showError(error)}
              />
            </div>
          </div>

          {/* Login Link */}
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary underline-offset-4 hover:underline">
              Sign in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
