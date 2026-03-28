import { Home } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-lg mb-3">
              <Home className="w-5 h-5 text-primary-light" />
              Tulsa<span className="text-accent">Home</span>Help
            </div>
            <p className="text-sm leading-relaxed">
              Connecting Tulsa homeowners with trusted local service providers.
              Pressure washing, lawn care, tree service, and more.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-gray-400 hover:text-white no-underline transition-colors">Home</Link>
              <Link to="/providers" className="text-sm text-gray-400 hover:text-white no-underline transition-colors">Browse Pros</Link>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">For Service Providers</h4>
            <p className="text-sm leading-relaxed mb-3">
              List your home services and get connected with Tulsa homeowners.
              First 90 days free.
            </p>
            <Link
              to="/providers"
              className="inline-block bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium no-underline hover:bg-primary-dark transition-colors"
            >
              Get Listed
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm">
          &copy; {new Date().getFullYear()} TulsaHomeHelp -- Tulsa, Oklahoma. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
