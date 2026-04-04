import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, Plus, LogOut, BookOpen } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-border">
      <nav className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between" aria-label="Main navigation">
        <Link to="/" className="font-serif text-lg text-bark tracking-tight flex items-center gap-2">
          <BookOpen size={20} className="text-sage" />
          My Recipe Box
        </Link>

        {user && (
          <>
            <div className="hidden sm:flex items-center gap-4">
              <Link to="/add" className="text-sm font-medium text-sage hover:text-sage-dark transition-colors flex items-center gap-1.5">
                <Plus size={16} />
                New Recipe
              </Link>
              <button
                onClick={handleSignOut}
                className="text-sm text-warm-gray hover:text-bark transition-colors flex items-center gap-1.5"
              >
                <LogOut size={15} />
                Sign Out
              </button>
            </div>

            <button
              className="sm:hidden p-2 text-bark"
              onClick={() => setOpen(o => !o)}
              aria-expanded={open}
              aria-label="Navigation menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </>
        )}
      </nav>

      {open && user && (
        <div className="sm:hidden bg-cream border-t border-border px-5 py-3 flex flex-col gap-2" role="menu">
          <Link to="/add" onClick={() => setOpen(false)} className="text-sm font-medium text-bark py-2" role="menuitem">
            New Recipe
          </Link>
          <button onClick={() => { setOpen(false); handleSignOut() }} className="text-sm text-warm-gray py-2 text-left" role="menuitem">
            Sign Out
          </button>
        </div>
      )}
    </header>
  )
}
