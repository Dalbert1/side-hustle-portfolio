import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { UserPlus, Eye, EyeOff } from 'lucide-react'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [rsn, setRsn] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    const { data, error } = await signUp(email, password, rsn)

    if (error) {
      setError(error.message)
      setLoading(false)
    } else if (data?.user?.identities?.length === 0) {
      setError('An account with this email already exists.')
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-start justify-center px-4 pt-16 sm:pt-24">
        <div className="w-full max-w-sm">
          <h2 className="text-xl font-bold text-gold mb-2">Check Your Email</h2>
          <p className="text-text-secondary text-sm mb-5">
            Confirmation link sent to <strong className="text-text-primary">{email}</strong>. Click it to activate your account.
          </p>
          <Link
            to="/login"
            className="inline-block bg-gold hover:bg-gold-hover text-text-on-gold font-semibold text-sm py-2 px-4 rounded-md transition-colors duration-150 no-underline"
          >
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-start justify-center px-4 pt-16 sm:pt-24">
      <div className="w-full max-w-sm">
        <header className="mb-6">
          <h1 className="text-xl font-bold text-gold">Create Account</h1>
          <p className="text-text-secondary text-sm mt-1">Limited to 5 users during early access.</p>
        </header>

        {error && (
          <div className="bg-danger/8 border border-danger/20 text-danger rounded-md p-2.5 mb-4 text-[13px]" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="signup-rsn" className="block text-[13px] font-medium text-text-primary mb-1">
              RSN <span className="text-text-muted font-normal">(optional)</span>
            </label>
            <input
              id="signup-rsn"
              type="text"
              value={rsn}
              onChange={e => setRsn(e.target.value)}
              maxLength={12}
              autoComplete="username"
              className="w-full px-3 py-2 bg-surface-raised border border-border-subtle rounded-md text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-gold transition-colors duration-150"
              placeholder="Your RuneScape name"
            />
          </div>

          <div>
            <label htmlFor="signup-email" className="block text-[13px] font-medium text-text-primary mb-1">Email</label>
            <input
              id="signup-email"
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
            <label htmlFor="signup-password" className="block text-[13px] font-medium text-text-primary mb-1">Password</label>
            <div className="relative">
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                className="w-full px-3 py-2 bg-surface-raised border border-border-subtle rounded-md text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-gold transition-colors duration-150 pr-9"
                placeholder="Min 6 characters"
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

          <div>
            <label htmlFor="signup-confirm" className="block text-[13px] font-medium text-text-primary mb-1">Confirm Password</label>
            <input
              id="signup-confirm"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="w-full px-3 py-2 bg-surface-raised border border-border-subtle rounded-md text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-gold transition-colors duration-150"
              placeholder="Confirm your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-1.5 bg-gold hover:bg-gold-hover text-text-on-gold font-semibold text-sm py-2 px-3 rounded-md transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-none"
          >
            <UserPlus className="w-3.5 h-3.5" aria-hidden="true" />
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-text-muted text-[13px] mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-gold hover:text-gold-hover transition-colors duration-150">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
