import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut, Swords, Plus, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  const navLinks = [
    { to: '/', label: 'Activities' },
  ]

  if (user) {
    navLinks.push({ to: '/my-setups', label: 'My Setups' })
    navLinks.push({ to: '/add-activity', label: 'Add Activity' })
  }

  return (
    <nav className="bg-dark-surface border-b border-dark-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <Swords className="w-5 h-5 text-gold" />
            <span className="text-gold font-bold text-lg">OSRS Activity Helper</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-5">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium no-underline transition-colors ${
                  location.pathname === link.to
                    ? 'text-gold'
                    : 'text-parchment-dim hover:text-gold'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <div className="flex items-center gap-3 ml-2">
                <span className="text-xs text-parchment-dim flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  {user.email?.split('@')[0]}
                </span>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 bg-dark-card hover:bg-dark-hover text-parchment-dim hover:text-gold border border-dark-border px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-gold hover:bg-gold-light text-dark-bg font-semibold px-4 py-1.5 rounded-lg text-sm no-underline transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-parchment-dim hover:text-gold bg-transparent border-none cursor-pointer"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-4 border-t border-dark-border">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`block py-3 px-2 text-sm font-medium no-underline ${
                  location.pathname === link.to
                    ? 'text-gold'
                    : 'text-parchment-dim'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <div className="py-2 px-2 text-xs text-parchment-dim flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  {user.email}
                </div>
                <button
                  onClick={() => { handleSignOut(); setOpen(false) }}
                  className="w-full text-left flex items-center gap-2 py-3 px-2 text-sm text-parchment-dim hover:text-gold bg-transparent border-none cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="block mt-2 bg-gold text-dark-bg text-center px-4 py-2 rounded-lg text-sm font-semibold no-underline"
              >
                Sign In
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
