import { motion } from 'framer-motion'
import { User, Phone, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

export const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement registration logic
    console.log('Registration data:', formData)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        ease: "easeOut",
        delay: 0.1
      }}
      className="auth-card"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="gradient-header" />
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-4xl font-bold auth-text mb-3"
        >
          Create Account
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="auth-text-muted text-lg"
        >
          Join the Round community
        </motion.p>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Fields Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label className="auth-label">First Name</label>
            <div className="input-container">
              <User className="input-icon-left auth-icon-primary" />
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="John"
                className="auth-input input-with-icon-left"
                required
              />
            </div>
          </div>

          {/* Last Name */}
          <div>
            <label className="auth-label">Last Name</label>
            <div className="input-container">
              <User className="input-icon-left auth-icon-primary" />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Doe"
                className="auth-input input-with-icon-left"
                required
              />
            </div>
          </div>
        </div>

        {/* Email Address */}
        <div>
          <label className="auth-label">Email Address</label>
          <div className="input-container">
            <Mail className="input-icon-left auth-icon-primary" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="example@gmail.com"
              className="auth-input input-with-icon-left"
              required
            />
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <label className="auth-label">Phone Number</label>
          <div className="input-container">
            <Phone className="input-icon-left auth-icon-primary" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+30 698 123 4567"
              className="auth-input input-with-icon-left"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="auth-label">Password</label>
          <div className="input-container">
            <Lock className="input-icon-left auth-icon-primary" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Create a strong password"
              className="auth-input input-with-icon-left input-with-icon-right"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="input-icon-right auth-icon hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="text-center">
          <p className="text-sm auth-text-muted">
            By creating an account you accept Round's{' '}
            <Link to="/terms" className="auth-link">
              terms and conditions
            </Link>
          </p>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="w-full btn-primary text-lg py-4 mt-8"
        >
          <span className="flex items-center justify-center space-x-2">
            <span>Create Account</span>
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            >
              ✨
            </motion.span>
          </span>
        </motion.button>

        {/* Login Link */}
        <div className="text-center">
          <p className="auth-text-muted">
            Already have an account?{' '}
            <Link to="/auth/login" className="auth-link">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </motion.div>
  )
}