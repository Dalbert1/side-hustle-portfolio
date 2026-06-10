import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, Plus, LogOut, ShoppingCart, UtensilsCrossed, User, BookOpen, Rss } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'

export default function Navbar() {
  const { user, displayName, signOut } = useAuth()
  const { cartCount } = useCart()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  function navClass(path) {
    const active = path === '/' ? pathname === '/' : pathname.startsWith(path)
    return `text-sm font-medium transition-colors flex items-center gap-1.5 ${
      active ? 'text-sage-light' : 'text-warm-gray hover:text-bark'
    }`
  }

  function mobileNavClass(path) {
    const active = path === '/' ? pathname === '/' : pathname.startsWith(path)
    return `text-sm font-medium py-2.5 px-3 rounded-lg transition-colors flex items-center gap-2 ${
      active ? 'text-sage-light bg-sage-muted/50' : 'text-bark hover:bg-cream-dark'
    }`
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
              <Link to="/" className={navClass('/')}>
                <Rss size={15} />
                Feed
              </Link>
              <Link to="/my-recipes" className={navClass('/my-recipes')}>
                <BookOpen size={15} />
                My Recipes
              </Link>
              <Link to="/add" className="text-sm font-medium text-sage hover:text-sage-light transition-colors flex items-center gap-1.5">
                <Plus size={16} />
                New Recipe
              </Link>
              <Link to="/cart" className={`${navClass('/cart')} relative`}>
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
          <Link to="/" onClick={() => setOpen(false)} className={mobileNavClass('/')} role="menuitem">
            <Rss size={15} />
            Feed
          </Link>
          <Link to="/my-recipes" onClick={() => setOpen(false)} className={mobileNavClass('/my-recipes')} role="menuitem">
            <BookOpen size={15} />
            My Recipes
          </Link>
          <Link to="/add" onClick={() => setOpen(false)} className={mobileNavClass('/add')} role="menuitem">
            <Plus size={15} />
            New Recipe
          </Link>
          <Link to="/cart" onClick={() => setOpen(false)} className={mobileNavClass('/cart')} role="menuitem">
            <ShoppingCart size={15} />
            Grocery Cart
            {cartCount > 0 && <span className="text-[10px] bg-terra text-white px-1.5 py-0.5 rounded-full font-bold">{cartCount}</span>}
          </Link>
          <Link to="/profile" onClick={() => setOpen(false)} className={mobileNavClass('/profile')} role="menuitem">
            <User size={15} />
            Profile
          </Link>
          <div className="border-t border-border mt-1 pt-2">
            <span className="text-xs text-warm-gray px-3">{displayName}</span>
            <button onClick={() => { setOpen(false); handleSignOut() }} className="text-sm text-warm-gray py-2.5 px-3 w-full text-left hover:text-bark transition-colors flex items-center gap-2" role="menuitem">
              <LogOut size={15} />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
