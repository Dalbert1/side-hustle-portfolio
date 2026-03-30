import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { Copy, Check, Linkedin, Mail } from 'lucide-react'

const EMAIL = 'Dylan.M.Albert1@gmail.com'
const LINKEDIN = 'https://www.linkedin.com/in/dylan-albert-87985614a/'

export default function Contact() {
  const { ref, inView } = useInView()
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(EMAIL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-8"
        >
          <div>
            <p className="text-slate-400 dark:text-text-secondary text-xs font-mono uppercase tracking-widest mb-3">Get In Touch</p>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-text-primary mb-3">Let's Connect</h2>
            <p className="text-slate-500 dark:text-text-secondary">
              Open to AI Engineering, Cloud Engineering, and Backend roles.
            </p>
          </div>

          {/* Email card */}
          <div className="w-full bg-white dark:bg-bg-surface border border-slate-200 dark:border-border rounded-xl px-6 py-5 flex items-center justify-between gap-4 shadow-sm dark:shadow-none">
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-accent-indigo flex-shrink-0" />
              <span className="font-mono text-sm text-slate-900 dark:text-text-primary break-all">{EMAIL}</span>
            </div>
            <div className="relative flex-shrink-0">
              <button
                onClick={handleCopy}
                className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-bg-card border border-slate-200 dark:border-border flex items-center justify-center hover:border-accent-indigo hover:text-accent-indigo text-slate-400 dark:text-text-secondary transition-colors"
                aria-label="Copy email address"
              >
                {copied ? <Check size={15} className="text-accent-current" /> : <Copy size={15} />}
              </button>
              {copied && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white dark:bg-bg-card border border-slate-200 dark:border-border text-slate-900 dark:text-text-primary text-[11px] px-2 py-1 rounded-md whitespace-nowrap shadow-sm"
                >
                  Copied!
                </motion.div>
              )}
            </div>
          </div>

          {/* LinkedIn button */}
          <a
            href={LINKEDIN}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-lg bg-accent-indigo text-white font-semibold text-sm hover:bg-indigo-500 transition-colors shadow-glow hover:shadow-glow-lg"
          >
            <Linkedin size={16} />
            Connect on LinkedIn
          </a>
        </motion.div>
      </div>
    </section>
  )
}
