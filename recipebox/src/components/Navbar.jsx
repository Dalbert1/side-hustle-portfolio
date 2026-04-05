import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, Plus, LogOut, ShoppingCart, UtensilsCrossed, User, BookOpen } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'

export default function Navbar() {
  const { user, displayName, signOut } = useAuth()
  const { cartCount } = useCart()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur-sm border-b border-border">
      <nav className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between" aria-label="Main navigation">
        <Link to="/" className="font-serif text-lg text-bark tracking-tight flex items-center gap-2">
          <UtensilsCrossed size={20} className="text-sage" />
          The Forking Good Club
        </Link>

        {user && (
          <>
            <div className="hidden sm:flex items-center gap-5">
              <Link to="/my-recipes" className="text-sm font-medium text-warm-gray hover:text-bark transition-colors flex items-center gap-1.5">
                <BookOpen size={15} />
                My Recipes
              </Link>
              <Link to="/add" className="text-sm font-medium text-sage hover:text-sage-light transition-colors flex items-center gap-1.5">
                <Plus size={16} />
                New Recipe
              </Link>
              <Link to="/cart" className="text-sm font-medium text-warm-gray hover:text-bark transition-colors flex items-center gap-1.5 relative">
                <ShoppingCart size={15} />
                Cart
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 w-4 h-4 bg-terra text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {cartCount > 99 ? '99' : cartCount}
                  </span>
                )}
              </Link>
              <div className="flex items-center gap-3 pl-3 border-l border-border">
                <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <div className="w-6 h-6 rounded-full bg-sage-muted flex items-center justify-center">
                    <span className="text-[9px] font-bold text-sage-light uppercase">{displayName[0]}</span>
                  </div>
                  <span className="text-xs text-warm-gray">{displayName}</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-xs text-warm-gray hover:text-bark transition-colors"
                  aria-label="Sign out"
                >
                  <LogOut size={15} />
                </button>
              </div>
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
        <div className="sm:hidden bg-cream border-t border-border px-5 py-3 flex flex-col gap-1" role="menu">
          <Link to="/" onClick={() => setOpen(false)} className="text-sm font-medium text-bark py-2.5 px-3 rounded-lg hover:bg-cream-dark transition-colors" role="menuitem">
            Feed
          </Link>
          <Link to="/my-recipes" onClick={() => setOpen(false)} className="text-sm font-medium text-bark py-2.5 px-3 rounded-lg hover:bg-cream-dark transition-colors" role="menuitem">
            My Recipes
          </Link>
          <Link to="/add" onClick={() => setOpen(false)} className="text-sm font-medium text-bark py-2.5 px-3 rounded-lg hover:bg-cream-dark transition-colors" role="menuitem">
            New Recipe
          </Link>
          <Link to="/cart" onClick={() => setOpen(false)} className="text-sm font-medium text-bark py-2.5 px-3 rounded-lg hover:bg-cream-dark transition-colors flex items-center gap-2" role="menuitem">
            Grocery Cart
            {cartCount > 0 && <span className="text-[10px] bg-terra text-white px-1.5 py-0.5 rounded-full font-bold">{cartCount}</span>}
          </Link>
          <Link to="/profile" onClick={() => setOpen(false)} className="text-sm font-medium text-bark py-2.5 px-3 rounded-lg hover:bg-cream-dark transition-colors flex items-center gap-2" role="menuitem">
            <User size={14} />
            Profile
          </Link>
          <div className="border-t border-border mt-1 pt-2">
            <span className="text-xs text-warm-gray px-3">{displayName}</span>
            <button onClick={() => { setOpen(false); handleSignOut() }} className="text-sm text-warm-gray py-2.5 px-3 w-full text-left hover:text-bark transition-colors" role="menuitem">
              Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
