import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { AuthLayout } from '@/features/auth/components/AuthLayout'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RegisterPage } from '@/features/auth/pages/RegisterPage'
import { PersonalRegisterPage } from '@/features/auth/pages/PersonalRegisterPage'
import { BusinessRegisterPage } from '@/features/auth/pages/BusinessRegisterPage'
import { HomePage } from '@/features/home/HomePage'

const App = () => (
  <Router>
    <Routes>
      <Route path="/auth/*" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="register/personal" element={<PersonalRegisterPage />} />
        <Route path="register/business" element={<BusinessRegisterPage />} />
      </Route>
      <Route path="/" element={<HomePage />} />
    </Routes>
  </Router>
)

export default App
