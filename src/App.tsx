import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { AuthProvider } from '@/shared/contexts/AuthContext'
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
import { HomePage } from '@/features/home/HomePage'

const App = () => {
  // Apply mobile optimizations
  useMobileOptimizations()

  return (
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
        </Route>
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
        <Route path="/" element={<HomePage />} />
      </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
