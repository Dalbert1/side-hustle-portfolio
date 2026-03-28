import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Home } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  const links = [
    { to: '/', label: 'Home' },
    { to: '/providers', label: 'Find Pros' },
  ]

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 text-primary font-bold text-xl no-underline">
            <Home className="w-6 h-6 text-primary" />
            <span>Tulsa<span className="text-accent">Home</span>Help</span>
          </Link>

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
              to="/providers"
              className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium no-underline hover:bg-primary-dark transition-colors"
            >
              Get a Free Quote
            </Link>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-gray-600 hover:text-primary"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-4 border-t border-gray-100">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`block py-3 px-2 text-sm font-medium no-underline ${
                  location.pathname === link.to ? 'text-primary' : 'text-gray-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/providers"
              onClick={() => setOpen(false)}
              className="block mt-2 bg-primary text-white text-center px-4 py-2 rounded-lg text-sm font-medium no-underline"
            >
              Get a Free Quote
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
