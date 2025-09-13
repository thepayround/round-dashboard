import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { AuthProvider } from '@/shared/contexts/AuthContext'
import { ToastProvider } from '@/shared/contexts/ToastContext'
import { useMobileOptimizations } from '@/shared/hooks/useMobileOptimizations'
import { ProtectedRoute } from '@/shared/components/ProtectedRoute'
import { AuthLayout } from '@/features/auth/components/AuthLayout'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RegisterPage } from '@/features/auth/pages/RegisterPage'
import { PersonalRegisterPage } from '@/features/auth/pages/PersonalRegisterPage'
import { BusinessRegisterPage } from '@/features/auth/pages/BusinessRegisterPage'
import { EmailConfirmationPage } from '@/features/auth/pages/EmailConfirmationPage'
import { ConfirmationPendingPage } from '@/features/auth/pages/ConfirmationPendingPage'
import { ResendConfirmationPage } from '@/features/auth/pages/ResendConfirmationPage'
import { ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage'
import { ResetPasswordPage } from '@/features/auth/pages/ResetPasswordPage'
import { InvitationAcceptancePage } from '@/features/auth/pages/InvitationAcceptancePage'
import { GetStartedPage } from '@/features/onboarding/pages/GetStartedPage'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { BillingPage } from '@/features/billing/pages/BillingPage'
import { InvoicesPage } from '@/features/billing/pages/InvoicesPage'
import { ProductCatalogPage } from '@/features/catalog/pages/ProductCatalogPage'
import { PlansPage } from '@/features/catalog/pages/PlansPage'
import { AddonsPage } from '@/features/catalog/pages/AddonsPage'
import { ChargesPage } from '@/features/catalog/pages/ChargesPage'
import { CouponsPage } from '@/features/catalog/pages/CouponsPage'
import CustomersPage from '@/features/customers/pages/CustomersPage'
import CustomerDetailPage from '@/features/customers/pages/CustomerDetailPage'
import { UserSettingsPage, OrganizationSettingsPage } from '@/features/settings'
import { HomePage } from '@/features/home/HomePage'

const App = () => {
  // Apply mobile optimizations
  useMobileOptimizations()

  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
      <Routes>
        <Route path="/auth/*" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="register/personal" element={<PersonalRegisterPage />} />
          <Route path="register/business" element={<BusinessRegisterPage />} />
          <Route path="confirm-email" element={<EmailConfirmationPage />} />
          <Route path="confirmation-pending" element={<ConfirmationPendingPage />} />
          <Route path="resend-confirmation" element={<ResendConfirmationPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
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
          path="/billing"
          element={
            <ProtectedRoute>
              <BillingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/invoices"
          element={
            <ProtectedRoute>
              <InvoicesPage />
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
          path="/catalog/addons"
          element={
            <ProtectedRoute>
              <AddonsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/catalog/charges"
          element={
            <ProtectedRoute>
              <ChargesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/catalog/coupons"
          element={
            <ProtectedRoute>
              <CouponsPage />
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
        <Route path="/" element={<HomePage />} />
      </Routes>
      </Router>
      </AuthProvider>
    </ToastProvider>
  )
}

export default App
