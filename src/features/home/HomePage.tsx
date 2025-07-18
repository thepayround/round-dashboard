import { Link } from 'react-router-dom'

export const HomePage = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-white mb-6">Welcome to Round</h1>
      <p className="text-xl text-gray-300 mb-8">Your billing and customer intelligence platform</p>
      <div className="space-x-4">
        <Link
          to="/auth/login"
          className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300"
        >
          Sign In
        </Link>
        <Link
          to="/auth/register"
          className="bg-white/10 text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-all duration-300"
        >
          Get Started
        </Link>
      </div>
    </div>
  </div>
)
