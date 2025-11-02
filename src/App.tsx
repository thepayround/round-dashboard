import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { AuthLayout } from '@/features/auth/components/AuthLayout'
import { BusinessLoginPage } from '@/features/auth/pages/BusinessLoginPage'
import { BusinessRegisterPage } from '@/features/auth/pages/BusinessRegisterPage'
import { ConfirmationPendingPage } from '@/features/auth/pages/ConfirmationPendingPage'
import { EmailConfirmationPage } from '@/features/auth/pages/EmailConfirmationPage'
import { ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage'
import { InvitationAcceptancePage } from '@/features/auth/pages/InvitationAcceptancePage'
import { PersonalLoginPage } from '@/features/auth/pages/PersonalLoginPage'
import { PersonalRegisterPage } from '@/features/auth/pages/PersonalRegisterPage'
import { RegisterPage } from '@/features/auth/pages/RegisterPage'
import { ResendConfirmationPage } from '@/features/auth/pages/ResendConfirmationPage'
import { ResetPasswordPage } from '@/features/auth/pages/ResetPasswordPage'
import { WelcomePage } from '@/features/auth/pages/WelcomePage'
import { PlansPage } from '@/features/catalog/pages/PlansPage'
import { ProductCatalogPage } from '@/features/catalog/pages/ProductCatalogPage'
import CustomerDetailPage from '@/features/customers/pages/CustomerDetailPage'
import CustomersPage from '@/features/customers/pages/CustomersPage'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { HomePage } from '@/features/home/HomePage'
import { GetStartedPage } from '@/features/onboarding/pages/GetStartedPage'
import { UserSettingsPage, OrganizationSettingsPage } from '@/features/settings'
import { ErrorBoundary } from '@/shared/components/ErrorBoundary'
import { ProtectedRoute } from '@/shared/components/ProtectedRoute'
import { AuthProvider } from '@/shared/contexts/AuthContext'
import { ToastProvider } from '@/shared/contexts/ToastContext'
import { useMobileOptimizations } from '@/shared/hooks/useMobileOptimizations'

const App = () => {
  // Apply mobile optimizations
  useMobileOptimizations()

  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <Router>
      <Routes>
        {/* Clean modern auth routes outside /auth prefix */}
        <Route path="/login" element={<AuthLayout><PersonalLoginPage /></AuthLayout>} />
        <Route path="/login/business" element={<AuthLayout><BusinessLoginPage /></AuthLayout>} />
        <Route path="/signup" element={<AuthLayout><PersonalRegisterPage /></AuthLayout>} />
        <Route path="/signup/business" element={<AuthLayout><BusinessRegisterPage /></AuthLayout>} />
        
        {/* Legacy auth routes (for existing links) */}
        <Route path="/auth/*" element={<AuthLayout />}>
          <Route path="confirm-email" element={<EmailConfirmationPage />} />
          <Route path="confirmation-pending" element={<ConfirmationPendingPage />} />
          <Route path="resend-confirmation" element={<ResendConfirmationPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
          
          {/* Legacy register route redirect */}
          <Route path="register" element={<RegisterPage />} />
        </Route>
        <Route path="/register" element={<InvitationAcceptancePage />} />
        <Route
          path="/get-started"
          element={
            <ProtectedRoute requireOnboarding>
              <GetStartedPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/catalog"
          element={
            <ProtectedRoute>
              <ProductCatalogPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/catalog/plans"
          element={
            <ProtectedRoute>
              <PlansPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <CustomersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers/:id"
          element={
            <ProtectedRoute>
              <CustomerDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-settings"
          element={
            <ProtectedRoute>
              <UserSettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <OrganizationSettingsPage />
            </ProtectedRoute>
          }
        />
        {/* Welcome page as landing page */}
        <Route path="/" element={<WelcomePage />} />
        
        {/* Home page (can be accessed separately) */}
        <Route path="/home" element={<HomePage />} />
      </Routes>
        </Router>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  )
}

export default App
