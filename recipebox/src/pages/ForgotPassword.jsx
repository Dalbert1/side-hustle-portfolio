import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { resetPassword } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await resetPassword(email)
    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-5">
        <div className="w-full max-w-sm text-center">
          <h1 className="font-serif text-2xl text-bark mb-4">Check your email</h1>
          <p className="text-sm text-warm-gray mb-6">
            We sent a password reset link to <strong className="text-bark">{email}</strong>.
            Click the link in the email to set a new password.
          </p>
          <Link to="/login" className="text-sm text-sage font-medium hover:underline">
            Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-2xl text-bark text-center mb-3">Reset Password</h1>
        <p className="text-sm text-warm-gray text-center mb-8">
          Enter your email and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <p className="text-sm text-terra bg-terra/5 border border-terra/20 rounded-lg px-4 py-2.5">{error}</p>
          )}

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-warm-gray uppercase tracking-wider">Email</span>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="px-4 py-2.5 rounded-lg border border-border bg-surface text-bark text-sm focus:border-sage focus:outline-none"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 px-6 py-2.5 bg-sage text-white font-semibold text-sm rounded-lg hover:bg-sage-dark disabled:opacity-50 transition-colors"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="text-center text-xs text-warm-gray mt-6">
          <Link to="/login" className="text-sage font-medium hover:underline">Back to sign in</Link>
        </p>
      </div>
    </div>
  )
}
