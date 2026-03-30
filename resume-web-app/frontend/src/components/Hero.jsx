import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { useReducedMotion } from '../hooks/useReducedMotion'

// Profile photo - drop profile.jpg into frontend/src/assets/ to enable
let profileSrc = null
try {
  /* @vite-ignore */
  profileSrc = new URL('../assets/profile.jpg', import.meta.url).href
} catch {
  profileSrc = null
}

const titles = [
  'AI Engineer',
  'Cloud Software Developer',
  'RAG & LLM Systems Builder',
  'Backend Engineer',
]

export default function Hero() {
  const prefersReducedMotion = useReducedMotion()
  const [titleIdx, setTitleIdx] = useState(0)
  const [displayed, setDisplayed] = useState(prefersReducedMotion ? titles[0] : '')
  const [typing, setTyping] = useState(!prefersReducedMotion)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    // If reduced motion, just cycle titles with a fade (no typing)
    if (prefersReducedMotion) {
      const interval = setInterval(() => {
        setTitleIdx(i => (i + 1) % titles.length)
      }, 3000)
      return () => clearInterval(interval)
    }

    const target = titles[titleIdx]
    if (typing) {
      if (displayed.length < target.length) {
        const t = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 60)
        return () => clearTimeout(t)
      } else {
        const t = setTimeout(() => setTyping(false), 2000)
        return () => clearTimeout(t)
      }
    } else {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35)
        return () => clearTimeout(t)
      } else {
        setTitleIdx(i => (i + 1) % titles.length)
        setTyping(true)
      }
    }
  }, [displayed, typing, titleIdx, prefersReducedMotion])

  // Update displayed text when cycling in reduced motion mode
  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayed(titles[titleIdx])
    }
  }, [titleIdx, prefersReducedMotion])

  const animate = !prefersReducedMotion

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background - light mode: subtle slate gradient; dark mode: indigo radial + grid */}
      <div className="absolute inset-0 pointer-events-none dark:hidden"
        style={{
          backgroundImage: `radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.06) 0%, transparent 70%)`,
        }}
      />
      <div className="absolute inset-0 pointer-events-none hidden dark:block"
        style={{
          backgroundImage: `radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.10) 0%, transparent 70%),
            linear-gradient(rgba(42,42,58,0.18) 1px, transparent 1px),
            linear-gradient(90deg, rgba(42,42,58,0.18) 1px, transparent 1px)`,
          backgroundSize: '100% 100%, 60px 60px, 60px 60px',
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-6 gap-6">
        {/* Profile photo */}
        <motion.div
          initial={animate ? { opacity: 0, scale: 0.9 } : false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {profileSrc && !imgError ? (
            <img
              src={profileSrc}
              alt="Dylan Albert"
              className="w-32 h-32 rounded-full object-cover ring-2 ring-accent-indigo shadow-glow-lg"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-32 h-32 rounded-full ring-2 ring-accent-indigo shadow-glow-lg bg-slate-100 dark:bg-bg-card flex items-center justify-center">
              <span className="text-3xl font-bold text-accent-indigo font-mono">DA</span>
            </div>
          )}
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={animate ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-text-primary tracking-tight"
        >
          Dylan Albert
        </motion.h1>

        {/* Animated subtitle */}
        <motion.div
          initial={animate ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="h-8 flex items-center"
        >
          <span className="text-xl md:text-2xl font-semibold text-accent-indigo font-mono">
            {displayed}
            <span className="inline-block w-[2px] h-5 bg-accent-indigo ml-0.5 animate-pulse align-middle" />
          </span>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={animate ? { opacity: 0, y: 10 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="max-w-xl text-slate-500 dark:text-text-secondary text-base md:text-lg leading-relaxed"
        >
          Building enterprise-grade AI applications and the infrastructure that powers them.
        </motion.p>

        {/* Location badge */}
        <motion.div
          initial={animate ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-bg-surface border border-slate-200 dark:border-border text-slate-500 dark:text-text-secondary text-sm shadow-sm dark:shadow-none"
        >
          <span>Tulsa, OK</span>
          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-border" />
          <span>Open to Remote</span>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={animate ? { opacity: 0, y: 10 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 mt-2"
        >
          <button
            onClick={() => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-6 py-2.5 rounded-lg bg-accent-indigo text-white font-semibold text-sm hover:bg-indigo-500 transition-colors shadow-glow"
          >
            View My Work
          </button>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-6 py-2.5 rounded-lg border border-slate-300 dark:border-border text-slate-600 dark:text-text-secondary font-semibold text-sm hover:border-accent-indigo hover:text-accent-indigo dark:hover:text-text-primary transition-colors bg-white dark:bg-transparent"
          >
            Get In Touch
          </button>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-400 dark:text-text-secondary"
        animate={animate ? { y: [0, 4, 0] } : {}}
        transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
        aria-hidden="true"
      >
        <ArrowDown size={18} strokeWidth={1.5} />
      </motion.div>
    </section>
  )
}
