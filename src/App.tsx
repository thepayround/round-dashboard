import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import { AuthLayout } from '@/features/auth/components/AuthLayout'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RegisterPage } from '@/features/auth/pages/RegisterPage'

const App = () => (
  <Router>
    <Routes>
      <Route path="/auth/*" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>
      <Route path="/" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  </Router>
)

export default App
