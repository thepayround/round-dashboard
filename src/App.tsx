import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { AuthProvider } from '@/shared/contexts/AuthContext'
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
import { HomePage } from '@/features/home/HomePage'

const App = () => (
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
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  </AuthProvider>
)

export default App
