import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, PartyPopper } from 'lucide-react'

const BASE = import.meta.env.BASE_URL

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  const links = [
    { to: '/', label: 'Home' },
    { to: '/vendors', label: 'Find Vendors' },
  ]

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <PartyPopper className="w-6 h-6 text-accent" />
            <span className="text-primary font-bold text-xl">918 Party Co.</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium no-underline transition-colors ${
                  location.pathname === link.to
                    ? 'text-primary'
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/vendors"
              className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium no-underline hover:bg-primary-dark transition-colors"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-gray-600 hover:text-primary"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-4 border-t border-gray-100">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`block py-3 px-2 text-sm font-medium no-underline ${
                  location.pathname === link.to
                    ? 'text-primary'
                    : 'text-gray-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/vendors"
              onClick={() => setOpen(false)}
              className="block mt-2 bg-primary text-white text-center px-4 py-2 rounded-lg text-sm font-medium no-underline"
            >
              Book Now
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
