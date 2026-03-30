import { useState, useEffect, useRef, useCallback } from 'react'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

const links = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Highlights', href: '#highlights' },
  { label: 'Education', href: '#education' },
  { label: 'Contact', href: '#contact' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')
  const { isDark, toggle } = useTheme()
  const menuRef = useRef(null)
  const hamburgerRef = useRef(null)

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 20)
        const sections = links.map(l => l.href.slice(1))
        for (const id of [...sections].reverse()) {
          const el = document.getElementById(id)
          if (el && window.scrollY >= el.offsetTop - 120) {
            setActive(id)
            break
          }
        }
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on Escape, trap focus inside drawer
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      setOpen(false)
      hamburgerRef.current?.focus()
    }
  }, [])

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown)
      // Focus first menu item
      const firstItem = menuRef.current?.querySelector('button')
      firstItem?.focus()
    } else {
      document.removeEventListener('keydown', handleKeyDown)
    }
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, handleKeyDown])

  const handleNav = (href) => {
    setOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'backdrop-blur-md bg-white/80 dark:bg-bg/80 border-b border-slate-200 dark:border-border shadow-sm dark:shadow-none' : ''}`}>
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between" aria-label="Main navigation">
        <a href="#" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          className="font-mono text-sm font-semibold text-accent-indigo tracking-widest uppercase">
          DA
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <li key={l.href}>
              <button
                onClick={() => handleNav(l.href)}
                className={`text-sm font-medium transition-colors ${active === l.href.slice(1) ? 'text-accent-indigo' : 'text-slate-500 dark:text-text-secondary hover:text-slate-900 dark:hover:text-text-primary'}`}
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggle}
            className="p-2 rounded-lg text-slate-500 dark:text-text-secondary hover:text-accent-indigo dark:hover:text-accent-indigo hover:bg-slate-100 dark:hover:bg-bg-card transition-colors"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Mobile hamburger */}
          <button
            ref={hamburgerRef}
            className="md:hidden p-2 text-slate-500 dark:text-text-secondary hover:text-slate-900 dark:hover:text-text-primary"
            onClick={() => setOpen(o => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Navigation menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={menuRef}
            role="menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="md:hidden bg-white dark:bg-bg-surface border-b border-slate-200 dark:border-border"
          >
            <ul className="flex flex-col px-6 py-4 gap-4">
              {links.map(l => (
                <li key={l.href} role="none">
                  <button
                    role="menuitem"
                    onClick={() => handleNav(l.href)}
                    className={`text-sm font-medium transition-colors ${active === l.href.slice(1) ? 'text-accent-indigo' : 'text-slate-500 dark:text-text-secondary hover:text-slate-900 dark:hover:text-text-primary'}`}
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
