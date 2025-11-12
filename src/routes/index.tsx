import { lazy, ReactNode } from 'react'
import type { RouteObject } from 'react-router-dom'
import { Navigate } from 'react-router-dom'

import { AuthLayout } from '@/features/auth/components/AuthLayout'
import { ProtectedRoute } from '@/shared/layout/ProtectedRoute'

const withAuthLayout = (node: ReactNode) => <AuthLayout>{node}</AuthLayout>
const withProtectedRoute = (node: ReactNode, options?: { requireOnboarding?: boolean }) => (
  <ProtectedRoute requireOnboarding={options?.requireOnboarding}>{node}</ProtectedRoute>
)

const WelcomePage = lazy(() =>
  import('@/features/auth/pages/WelcomePage').then(module => ({ default: module.WelcomePage }))
)
const HomePage = lazy(() =>
  import('@/features/home/HomePage').then(module => ({ default: module.HomePage }))
)
const PersonalLoginPage = lazy(() =>
  import('@/features/auth/pages/PersonalLoginPage').then(module => ({ default: module.PersonalLoginPage }))
)
const BusinessLoginPage = lazy(() =>
  import('@/features/auth/pages/BusinessLoginPage').then(module => ({ default: module.BusinessLoginPage }))
)
const PersonalRegisterPage = lazy(() =>
  import('@/features/auth/pages/PersonalRegisterPage').then(module => ({
    default: module.PersonalRegisterPage
  }))
)
const BusinessRegisterPage = lazy(() =>
  import('@/features/auth/pages/BusinessRegisterPage').then(module => ({
    default: module.BusinessRegisterPage
  }))
)
const RegisterPage = lazy(() =>
  import('@/features/auth/pages/RegisterPage').then(module => ({ default: module.RegisterPage }))
)
const EmailConfirmationPage = lazy(() =>
  import('@/features/auth/pages/EmailConfirmationPage').then(module => ({
    default: module.EmailConfirmationPage
  }))
)
const ConfirmationPendingPage = lazy(() =>
  import('@/features/auth/pages/ConfirmationPendingPage').then(module => ({
    default: module.ConfirmationPendingPage
  }))
)
const ResendConfirmationPage = lazy(() =>
  import('@/features/auth/pages/ResendConfirmationPage').then(module => ({
    default: module.ResendConfirmationPage
  }))
)
const ForgotPasswordPage = lazy(() =>
  import('@/features/auth/pages/ForgotPasswordPage').then(module => ({
    default: module.ForgotPasswordPage
  }))
)
const ResetPasswordPage = lazy(() =>
  import('@/features/auth/pages/ResetPasswordPage').then(module => ({
    default: module.ResetPasswordPage
  }))
)
const InvitationAcceptancePage = lazy(() =>
  import('@/features/auth/pages/InvitationAcceptancePage').then(module => ({
    default: module.InvitationAcceptancePage
  }))
)
const GetStartedPage = lazy(() =>
  import('@/features/onboarding/pages/GetStartedPage').then(module => ({
    default: module.GetStartedPage
  }))
)
const DashboardPage = lazy(() =>
  import('@/features/dashboard/pages/DashboardPage').then(module => ({
    default: module.DashboardPage
  }))
)
const ProductCatalogPage = lazy(() =>
  import('@/features/catalog/pages/ProductCatalogPage').then(module => ({
    default: module.ProductCatalogPage
  }))
)
const PlansPage = lazy(() =>
  import('@/features/catalog/pages/PlansPage').then(module => ({
    default: module.PlansPage
  }))
)
const CustomersPage = lazy(() => import('@/features/customers/pages/CustomersPage'))
const CustomerDetailPage = lazy(() => import('@/features/customers/pages/CustomerDetailPage'))
const UserSettingsPage = lazy(() => import('@/features/settings/pages/UserSettingsPage'))
const OrganizationSettingsPage = lazy(() =>
  import('@/features/settings/pages/OrganizationSettingsPage').then(module => ({
    default: module.OrganizationSettingsPage
  }))
)

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <WelcomePage />
  },
  {
    path: '/home',
    element: <HomePage />
  },
  {
    path: '/login',
    element: withAuthLayout(<PersonalLoginPage />)
  },
  {
    path: '/login/business',
    element: withAuthLayout(<BusinessLoginPage />)
  },
  {
    path: '/signup',
    element: withAuthLayout(<PersonalRegisterPage />)
  },
  {
    path: '/signup/business',
    element: withAuthLayout(<BusinessRegisterPage />)
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'confirm-email', element: <EmailConfirmationPage /> },
      { path: 'confirmation-pending', element: <ConfirmationPendingPage /> },
      { path: 'resend-confirmation', element: <ResendConfirmationPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'reset-password', element: <ResetPasswordPage /> },
      { path: 'register', element: <RegisterPage /> }
    ]
  },
  {
    path: '/register',
    element: <InvitationAcceptancePage />
  },
  {
    path: '/get-started',
    element: withProtectedRoute(<GetStartedPage />, { requireOnboarding: true })
  },
  {
    path: '/dashboard',
    element: withProtectedRoute(<DashboardPage />)
  },
  {
    path: '/catalog',
    element: withProtectedRoute(<ProductCatalogPage />)
  },
  {
    path: '/catalog/plans',
    element: withProtectedRoute(<PlansPage />)
  },
  {
    path: '/customers',
    element: withProtectedRoute(<CustomersPage />)
  },
  {
    path: '/customers/:id',
    element: withProtectedRoute(<CustomerDetailPage />)
  },
  {
    path: '/user-settings',
    element: withProtectedRoute(<UserSettingsPage />)
  },
  {
    path: '/settings',
    element: withProtectedRoute(<OrganizationSettingsPage />)
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]

