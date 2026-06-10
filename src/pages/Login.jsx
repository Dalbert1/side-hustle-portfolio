import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { UtensilsCrossed } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
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
    <div className="min-h-[80vh] flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-4">
          <UtensilsCrossed size={36} className="text-sage" />
        </div>
        <h1 className="font-serif text-2xl text-bark text-center mb-2">Sign In</h1>
        <p className="text-xs text-warm-gray text-center mb-8">The Forking Good Club</p>

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

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-warm-gray uppercase tracking-wider">Password</span>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="px-4 py-2.5 rounded-lg border border-border bg-surface text-bark text-sm focus:border-sage focus:outline-none"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 px-6 py-2.5 bg-sage text-white font-semibold text-sm rounded-lg hover:bg-sage-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-6 flex flex-col gap-2">
          <Link to="/forgot-password" className="text-xs text-warm-gray hover:text-sage transition-colors">Forgot password?</Link>
          <p className="text-xs text-warm-gray">
            Need an account? <Link to="/signup" className="text-sage font-medium hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
