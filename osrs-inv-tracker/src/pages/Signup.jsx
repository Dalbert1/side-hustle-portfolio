import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { UserPlus, Eye, EyeOff } from 'lucide-react'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

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
    const { data, error } = await signUp(email, password)

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
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-dark-card border border-dark-border rounded-xl p-8 text-center">
            <div className="text-4xl mb-3">&#9989;</div>
            <h2 className="text-xl font-bold text-gold mb-2">Check Your Email</h2>
            <p className="text-parchment-dim text-sm mb-6">
              We sent a confirmation link to <strong className="text-parchment">{email}</strong>.
              Click the link to activate your account.
            </p>
            <Link
              to="/login"
              className="inline-block bg-gold hover:bg-gold-light text-dark-bg font-semibold py-2.5 px-6 rounded-lg transition-colors no-underline"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-dark-card border border-dark-border rounded-xl p-8">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">&#128737;&#65039;</div>
            <h1 className="text-2xl font-bold text-gold">Create Account</h1>
            <p className="text-parchment-dim text-sm mt-1">Join the OSRS Activity Helper (limited to 5 users)</p>
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
                  minLength={6}
                  className="w-full px-4 py-2.5 bg-dark-surface border border-dark-border rounded-lg text-parchment placeholder-parchment-dim/50 focus:outline-none focus:border-gold transition-colors pr-10"
                  placeholder="Min 6 characters"
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

            <div>
              <label className="block text-sm font-medium text-parchment mb-1.5">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-dark-surface border border-dark-border rounded-lg text-parchment placeholder-parchment-dim/50 focus:outline-none focus:border-gold transition-colors"
                placeholder="Confirm your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gold hover:bg-gold-light text-dark-bg font-semibold py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-none"
            >
              <UserPlus className="w-4 h-4" />
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-parchment-dim text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-gold hover:text-gold-light transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
