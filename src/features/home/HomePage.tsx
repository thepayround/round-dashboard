import { Link } from 'react-router-dom'

export const HomePage = () => (
  <div className="min-h-screen bg-[#000000] flex items-center justify-center p-4">
    <div className="text-center">
      <h1 className="text-4xl font-extralight text-white mb-6 tracking-wider">Welcome to <span className="font-extralight text-[#BD2CD0] drop-shadow-[0_0_15px_rgba(189,44,208,0.7)]">Round</span></h1>
      <p className="text-xl text-gray-300 mb-8">Your billing and customer intelligence platform</p>
      <div className="space-x-4">
        <Link
          to="/login"
          className="bg-primary text-white px-6 py-3 rounded-xl hover:shadow-hover transition-all duration-fast"
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
