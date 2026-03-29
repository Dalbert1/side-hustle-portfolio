import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut, Swords, User, Globe } from 'lucide-react'
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
    { to: '/community', label: 'Community' },
  ]

  if (user) {
    navLinks.push({ to: '/my-setups', label: 'My Setups' })
    navLinks.push({ to: '/add-activity', label: 'Add New' })
  }

  function isActive(path) {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="bg-surface-raised/80 backdrop-blur-sm border-b border-border-subtle sticky top-0 z-50" role="navigation" aria-label="Main navigation">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between h-12 items-center">
          <Link to="/" className="flex items-center gap-2 no-underline group" aria-label="OSRS Activity Helper home">
            <Swords className="w-4.5 h-4.5 text-gold transition-colors duration-150 group-hover:text-gold-hover" aria-hidden="true" />
            <span className="text-gold font-semibold text-sm tracking-tight hidden sm:inline">OSRS Activity Helper</span>
            <span className="text-gold font-semibold text-sm sm:hidden">OSRS Helper</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-[13px] font-medium no-underline px-2.5 py-1.5 rounded-md transition-colors duration-150 ${
                  isActive(link.to)
                    ? 'text-gold bg-surface-overlay'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-overlay/50'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="w-px h-5 bg-border-subtle mx-2" aria-hidden="true" />

            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-text-muted flex items-center gap-1">
                  <User className="w-3 h-3" aria-hidden="true" />
                  {user.email?.split('@')[0]}
                </span>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1 text-[12px] text-text-secondary hover:text-gold px-2 py-1 rounded-md transition-colors duration-150 cursor-pointer bg-transparent border-none"
                  aria-label="Sign out"
                >
                  <LogOut className="w-3 h-3" aria-hidden="true" />
                  <span>Out</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-[13px] font-semibold text-text-on-gold bg-gold hover:bg-gold-hover px-3 py-1.5 rounded-md no-underline transition-colors duration-150"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-1.5 text-text-secondary hover:text-gold bg-transparent border-none cursor-pointer rounded-md transition-colors duration-150"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-3 border-t border-border-subtle mt-1 pt-2" role="menu">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                role="menuitem"
                className={`block py-2 px-2 text-sm font-medium no-underline rounded-md transition-colors duration-150 ${
                  isActive(link.to)
                    ? 'text-gold bg-surface-overlay'
                    : 'text-text-secondary'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <div className="py-1.5 px-2 text-xs text-text-muted flex items-center gap-1 mt-1 border-t border-border-subtle pt-2">
                  <User className="w-3 h-3" aria-hidden="true" />
                  {user.email}
                </div>
                <button
                  onClick={() => { handleSignOut(); setOpen(false) }}
                  role="menuitem"
                  className="w-full text-left flex items-center gap-1.5 py-2 px-2 text-sm text-text-secondary hover:text-gold bg-transparent border-none cursor-pointer rounded-md"
                >
                  <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                role="menuitem"
                className="block mt-2 bg-gold text-text-on-gold text-center px-3 py-2 rounded-md text-sm font-semibold no-underline"
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
