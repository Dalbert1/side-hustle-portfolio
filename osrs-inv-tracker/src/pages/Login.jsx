import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { LogIn, Eye, EyeOff } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await signIn(email, password)

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/')
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-dark-card border border-dark-border rounded-xl p-8">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">&#9876;&#65039;</div>
            <h1 className="text-2xl font-bold text-gold">Welcome Back</h1>
            <p className="text-parchment-dim text-sm mt-1">Sign in to your OSRS Activity Helper</p>
          </div>

          {error && (
            <div className="bg-danger/10 border border-danger/30 text-danger rounded-lg p-3 mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-parchment mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-dark-surface border border-dark-border rounded-lg text-parchment placeholder-parchment-dim/50 focus:outline-none focus:border-gold transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-parchment mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-dark-surface border border-dark-border rounded-lg text-parchment placeholder-parchment-dim/50 focus:outline-none focus:border-gold transition-colors pr-10"
                  placeholder="Your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-parchment-dim hover:text-gold transition-colors bg-transparent border-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gold hover:bg-gold-light text-dark-bg font-semibold py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-none"
            >
              <LogIn className="w-4 h-4" />
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-parchment-dim text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-gold hover:text-gold-light transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
