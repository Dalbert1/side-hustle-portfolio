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
    <div className="min-h-[80vh] flex items-start justify-center px-4 pt-16 sm:pt-24">
      <div className="w-full max-w-sm">
        <header className="mb-6">
          <h1 className="text-xl font-bold text-gold">Sign In</h1>
          <p className="text-text-secondary text-sm mt-1">Welcome back to your setups.</p>
        </header>

        {error && (
          <div className="bg-danger/8 border border-danger/20 text-danger rounded-md p-2.5 mb-4 text-[13px]" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="block text-[13px] font-medium text-text-primary mb-1">Email</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-3 py-2 bg-surface-raised border border-border-subtle rounded-md text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-gold transition-colors duration-150"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="login-password" className="block text-[13px] font-medium text-text-primary mb-1">Password</label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full px-3 py-2 bg-surface-raised border border-border-subtle rounded-md text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-gold transition-colors duration-150 pr-9"
                placeholder="Your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-gold transition-colors duration-150 bg-transparent border-none cursor-pointer p-0.5"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-1.5 bg-gold hover:bg-gold-hover text-text-on-gold font-semibold text-sm py-2 px-3 rounded-md transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-none"
          >
            <LogIn className="w-3.5 h-3.5" aria-hidden="true" />
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-text-muted text-[13px] mt-5">
          No account?{' '}
          <Link to="/signup" className="text-gold hover:text-gold-hover transition-colors duration-150">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
