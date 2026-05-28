import { useState, useEffect } from 'react'
import {
  Mail, ArrowRight, Play, MapPin, Menu, X, ExternalLink,
} from 'lucide-react'

const BASE = import.meta.env.BASE_URL

function InstagramIcon({ className = '', size = 24, strokeWidth, ...rest }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth ?? 1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...rest}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  )
}

function YouTubeIcon({ className = '', size = 24, strokeWidth, ...rest }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth ?? 1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...rest}
    >
      <rect x="2.5" y="5" width="19" height="14" rx="3.5" />
      <path d="M10.5 9.2v5.6l4.8-2.8z" fill="currentColor" stroke="none" />
    </svg>
  )
}

const SOCIALS = [
  {
    name: 'Instagram',
    handle: '@austinalbert25',
    href: 'https://www.instagram.com/austinalbert25',
    icon: InstagramIcon,
    blurb: 'Behind the scenes, road shots, new song teasers.',
  },
  {
    name: 'YouTube',
    handle: '@austinalbert6',
    href: 'https://www.youtube.com/@austinalbert6',
    icon: YouTubeIcon,
    blurb: 'Full music videos and live performance footage.',
  },
  {
    name: 'TikTok',
    handle: '@austinalbert11',
    href: 'https://www.tiktok.com/@austinalbert11',
    icon: TikTokIcon,
    blurb: 'Short clips, covers, and unreleased hooks.',
  },
]

const FEATURED_VIDEO_ID = 'owxIEq_pI_Y'
const FEATURED_VIDEO_URL = `https://www.youtube.com/watch?v=${FEATURED_VIDEO_ID}`
const BOOKING_EMAIL = 'austinalbertmusic@gmail.com'

function TikTokIcon({ className = '', size = 24, strokeWidth, ...rest }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth ?? 1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...rest}
    >
      <path d="M19.5 8.5a6 6 0 0 1-4.5-2v8.25a5.25 5.25 0 1 1-5.25-5.25" />
      <path d="M15 2.5v6" />
    </svg>
  )
}

export default function App() {
  const [navOpen, setNavOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showVideo, setShowVideo] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen bg-night text-dust selection:bg-rust selection:text-dust">
      <Nav navOpen={navOpen} setNavOpen={setNavOpen} scrolled={scrolled} />
      <Hero />
      <Ticker />
      <About />
      <Watch showVideo={showVideo} setShowVideo={setShowVideo} />
      <Follow />
      <Booking />
      <Footer />
    </div>
  )
}

/* ─── Nav ────────────────────────────────────────────────────── */

function Nav({ navOpen, setNavOpen, scrolled }) {
  const links = [
    ['About', '#about'],
    ['Watch', '#watch'],
    ['Follow', '#follow'],
    ['Booking', '#booking'],
  ]

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-night/85 backdrop-blur-md border-b border-dust/10'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8 py-4">
        <a href="#top" className="flex items-center gap-3 group">
          <span className="font-display text-2xl tracking-widest text-dust group-hover:text-amber-warm transition-colors">
            AUSTIN&nbsp;ALBERT
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-9">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="text-sm uppercase tracking-[0.18em] text-dust/70 hover:text-amber-warm transition-colors"
            >
              {label}
            </a>
          ))}
          <a
            href={`mailto:${BOOKING_EMAIL}`}
            className="inline-flex items-center gap-2 rounded-full bg-amber-warm text-night px-5 py-2 text-sm font-semibold uppercase tracking-wider hover:bg-dust transition-colors"
          >
            Book a Show <ArrowRight size={16} />
          </a>
        </nav>

        <button
          className="md:hidden text-dust"
          onClick={() => setNavOpen(!navOpen)}
          aria-label="Toggle menu"
        >
          {navOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {navOpen && (
        <div className="md:hidden border-t border-dust/10 bg-night/95 backdrop-blur">
          <div className="px-5 py-6 flex flex-col gap-5">
            {links.map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={() => setNavOpen(false)}
                className="text-base uppercase tracking-[0.18em] text-dust/80"
              >
                {label}
              </a>
            ))}
            <a
              href={`mailto:${BOOKING_EMAIL}`}
              onClick={() => setNavOpen(false)}
              className="inline-flex w-fit items-center gap-2 rounded-full bg-amber-warm text-night px-5 py-2 text-sm font-semibold uppercase tracking-wider"
            >
              Book a Show <ArrowRight size={16} />
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

/* ─── Hero ───────────────────────────────────────────────────── */

function Hero() {
  return (
    <section id="top" className="relative min-h-screen overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${BASE}images/austin.jpg)`,
          filter: 'grayscale(0.15) contrast(1.05)',
        }}
        aria-hidden
      />
      {/* Cinematic gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-night via-night/55 to-night/85" aria-hidden />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 20% 60%, rgba(0,0,0,0) 0%, rgba(12,9,7,0.55) 60%, rgba(12,9,7,0.95) 100%)',
        }}
        aria-hidden
      />
      {/* warm light bleed */}
      <div
        className="absolute -top-32 -right-32 w-[60vw] h-[60vw] rounded-full opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(212,148,58,0.5) 0%, transparent 60%)' }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 pt-44 sm:pt-52 pb-32 min-h-screen flex flex-col justify-between">
        <div className="reveal">
          <div className="flex items-center gap-3 text-amber-warm/90 mb-7">
            <span className="h-px w-12 bg-amber-warm/60" />
            <span className="font-display text-sm tracking-[0.32em]">Country · Red Dirt · Live</span>
          </div>

          <h1 className="font-display text-[clamp(3.5rem,12vw,9.5rem)] leading-[0.85] text-dust">
            AUSTIN
            <br />
            <span className="text-amber-warm">ALBERT</span>
          </h1>

          <p className="mt-7 font-serif-display italic text-2xl sm:text-3xl text-dust/90 max-w-2xl leading-snug">
            From 90s country to modern Red Dirt, a voice straight out of Western Oklahoma.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#watch"
              className="inline-flex items-center gap-2 rounded-full bg-amber-warm text-night px-7 py-3 font-semibold uppercase tracking-wider hover:bg-dust transition-colors"
            >
              <Play size={18} fill="currentColor" /> Watch the Latest
            </a>
            <a
              href={`mailto:${BOOKING_EMAIL}`}
              className="inline-flex items-center gap-2 rounded-full border border-dust/40 text-dust px-7 py-3 font-semibold uppercase tracking-wider hover:border-amber-warm hover:text-amber-warm transition-colors"
            >
              Book a Show <ArrowRight size={18} />
            </a>
          </div>
        </div>

        {/* Hero footer row */}
        <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6 text-dust/70">
          <div>
            <div className="text-[0.65rem] uppercase tracking-[0.28em] text-amber-warm/80 mb-1">Based</div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin size={14} /> Western Oklahoma
            </div>
          </div>
          <div>
            <div className="text-[0.65rem] uppercase tracking-[0.28em] text-amber-warm/80 mb-1">Sound</div>
            <div className="text-sm">90s Country · Red Dirt</div>
          </div>
          <div>
            <div className="text-[0.65rem] uppercase tracking-[0.28em] text-amber-warm/80 mb-1">Roles</div>
            <div className="text-sm">Singer · Songwriter</div>
          </div>
          <div>
            <div className="text-[0.65rem] uppercase tracking-[0.28em] text-amber-warm/80 mb-1">Booking</div>
            <a
              href={`mailto:${BOOKING_EMAIL}`}
              className="text-sm hover:text-amber-warm transition-colors break-all"
            >
              {BOOKING_EMAIL}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Ticker ─────────────────────────────────────────────────── */

function Ticker() {
  const items = [
    'SINGER',
    'SONGWRITER',
    'WESTERN OKLAHOMA',
    '90s COUNTRY',
    'RED DIRT',
    'LIVE SHOWS',
    'ORIGINALS',
  ]
  const sequence = [...items, ...items, ...items, ...items]
  return (
    <div className="border-y border-dust/10 bg-coal/60 py-5 overflow-hidden">
      <div className="marquee-track flex items-center gap-12 whitespace-nowrap">
        {sequence.map((word, i) => (
          <span key={i} className="flex items-center gap-12">
            <span className="font-display text-3xl tracking-[0.22em] text-dust/80">
              {word}
            </span>
            <span className="text-amber-warm text-3xl leading-none">★</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ─── About ──────────────────────────────────────────────────── */

function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <div className="lg:col-span-5 order-2 lg:order-1">
          <div className="relative">
            <div
              className="aspect-[3/4] w-full rounded-sm bg-cover bg-center shadow-2xl"
              style={{ backgroundImage: `url(${BASE}images/austin.jpg)` }}
            />
            <div className="absolute -inset-2 -z-10 border border-amber-warm/30 translate-x-3 translate-y-3 rounded-sm" />
          </div>
        </div>

        <div className="lg:col-span-7 order-1 lg:order-2">
          <div className="grid grid-cols-3 gap-6 border-t border-dust/10 pt-8">
            <Stat label="Roots" value="Western OK" />
            <Stat label="Sound" value="Red Dirt" />
            <Stat label="Vibe" value="Live & Loud" />
          </div>
        </div>
      </div>
    </section>
  )
}

function Stat({ label, value }) {
  return (
    <div>
      <div className="text-[0.65rem] uppercase tracking-[0.28em] text-amber-warm/80 mb-2">
        {label}
      </div>
      <div className="font-display text-2xl tracking-wider text-dust">{value}</div>
    </div>
  )
}

/* ─── Watch ──────────────────────────────────────────────────── */

function Watch({ showVideo, setShowVideo }) {
  const thumb = `https://i.ytimg.com/vi/${FEATURED_VIDEO_ID}/maxresdefault.jpg`

  return (
    <section id="watch" className="relative py-24 sm:py-32 horizon-glow">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex items-center gap-3 text-amber-warm/90 mb-6">
          <span className="h-px w-10 bg-amber-warm/60" />
          <span className="font-display text-xs tracking-[0.32em]">Featured Video</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <h2 className="font-display text-5xl sm:text-6xl leading-[0.9] text-dust">
            WATCH &
            <br />
            <span className="text-amber-warm">LISTEN</span>
          </h2>
          <a
            href="https://www.youtube.com/@austinalbert6"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.22em] text-dust/80 hover:text-amber-warm transition-colors w-fit"
          >
            All Videos on YouTube <ArrowRight size={16} />
          </a>
        </div>

        <div className="relative aspect-video w-full rounded-md overflow-hidden border border-dust/15 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
          {showVideo ? (
            <iframe
              src={`https://www.youtube.com/embed/${FEATURED_VIDEO_ID}?autoplay=1&rel=0`}
              title="Austin Albert featured video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          ) : (
            <button
              type="button"
              onClick={() => setShowVideo(true)}
              className="group absolute inset-0 w-full h-full"
              aria-label="Play featured video"
            >
              <img
                src={thumb}
                alt="Austin Albert featured video thumbnail"
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = `https://i.ytimg.com/vi/${FEATURED_VIDEO_ID}/hqdefault.jpg`
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-night/85 via-night/30 to-night/40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-amber-warm text-night shadow-2xl group-hover:scale-110 transition-transform">
                  <Play size={42} fill="currentColor" />
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-left">
                <div className="font-display text-2xl tracking-wider text-dust">
                  PLAY FEATURED VIDEO
                </div>
                <div className="text-sm text-dust/70 mt-1">
                  Click to watch on YouTube
                </div>
              </div>
            </button>
          )}
        </div>

        <a
          href={FEATURED_VIDEO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-xs text-dust/60 hover:text-amber-warm transition-colors"
        >
          Open on YouTube <ExternalLink size={12} />
        </a>
      </div>
    </section>
  )
}

/* ─── Follow ─────────────────────────────────────────────────── */

function Follow() {
  return (
    <section id="follow" className="relative py-24 sm:py-32 bg-coal/40 border-y border-dust/10">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex items-center gap-3 text-amber-warm/90 mb-6">
          <span className="h-px w-10 bg-amber-warm/60" />
          <span className="font-display text-xs tracking-[0.32em]">Follow Along</span>
        </div>

        <h2 className="font-display text-5xl sm:text-6xl leading-[0.9] text-dust mb-12">
          STAY IN
          <br />
          <span className="text-amber-warm">THE LOOP</span>
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SOCIALS.map((s) => (
            <SocialCard key={s.name} {...s} />
          ))}
        </div>
      </div>
    </section>
  )
}

function SocialCard({ name, handle, href, icon: Icon, blurb }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block p-7 rounded-md border border-dust/15 bg-night/60 hover:border-amber-warm/70 hover:bg-night/90 transition-all overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background:
            'radial-gradient(circle at 80% 0%, rgba(212,148,58,0.18), transparent 60%)',
        }}
        aria-hidden
      />
      <div className="relative flex items-center justify-between mb-6">
        <span className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-dust/25 text-dust group-hover:text-amber-warm group-hover:border-amber-warm/60 transition-colors">
          <Icon size={22} />
        </span>
        <ArrowRight
          size={20}
          className="text-dust/40 group-hover:text-amber-warm group-hover:translate-x-1 transition-all"
        />
      </div>
      <div className="relative">
        <div className="font-display text-3xl tracking-wider text-dust mb-1">
          {name.toUpperCase()}
        </div>
        <div className="text-amber-warm/90 text-sm font-medium mb-3">{handle}</div>
        <p className="text-sm text-dust/65 leading-relaxed">{blurb}</p>
      </div>
    </a>
  )
}

/* ─── Booking ────────────────────────────────────────────────── */

function Booking() {
  return (
    <section id="booking" className="relative py-28 sm:py-36 overflow-hidden">
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(182,90,50,0.35), transparent 60%)',
        }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-4xl px-5 sm:px-8 text-center">
        <div className="flex items-center justify-center gap-3 text-amber-warm/90 mb-7">
          <span className="h-px w-10 bg-amber-warm/60" />
          <span className="font-display text-xs tracking-[0.32em]">Booking & Shows</span>
          <span className="h-px w-10 bg-amber-warm/60" />
        </div>

        <h2 className="font-display text-6xl sm:text-7xl lg:text-8xl leading-[0.88] text-dust">
          BOOK
          <br />
          <span className="text-amber-warm">AUSTIN</span>
        </h2>

        <p className="mt-8 font-serif-display italic text-xl sm:text-2xl text-dust/85 max-w-2xl mx-auto leading-relaxed">
          Bars, festivals, weddings, private events, anything country.
          Reach out direct and let's put a date on the calendar.
        </p>

        <div className="mt-12 flex flex-col items-center gap-5">
          <a
            href={`mailto:${BOOKING_EMAIL}?subject=Booking%20Inquiry%20-%20Austin%20Albert`}
            className="group inline-flex items-center gap-3 rounded-full bg-amber-warm text-night px-9 py-4 text-base font-bold uppercase tracking-[0.18em] hover:bg-dust transition-colors"
          >
            <Mail size={20} />
            {BOOKING_EMAIL}
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <div className="text-xs uppercase tracking-[0.28em] text-dust/50">
            Direct email · Fastest response
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Footer ─────────────────────────────────────────────────── */

function Footer() {
  return (
    <footer className="border-t border-dust/10 bg-coal/60">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-12 grid sm:grid-cols-3 gap-8 items-start">
        <div>
          <div className="font-display text-2xl tracking-widest text-dust mb-3">
            AUSTIN ALBERT
          </div>
          <p className="text-sm text-dust/55 leading-relaxed max-w-xs">
            Singer and songwriter from Western Oklahoma. 90s country meets modern Red Dirt.
          </p>
        </div>

        <div>
          <div className="text-[0.65rem] uppercase tracking-[0.28em] text-amber-warm/80 mb-3">
            Follow
          </div>
          <ul className="space-y-2 text-sm">
            {SOCIALS.map((s) => (
              <li key={s.name}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-dust/70 hover:text-amber-warm transition-colors"
                >
                  <s.icon size={14} /> {s.name} {s.handle}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-[0.65rem] uppercase tracking-[0.28em] text-amber-warm/80 mb-3">
            Booking
          </div>
          <a
            href={`mailto:${BOOKING_EMAIL}`}
            className="text-sm text-dust/80 hover:text-amber-warm transition-colors break-all"
          >
            {BOOKING_EMAIL}
          </a>
          <div className="mt-3 flex items-center gap-2 text-xs text-dust/50">
            <MapPin size={12} /> Western Oklahoma
          </div>
        </div>
      </div>

      <div className="border-t border-dust/10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-dust/40">
          <div>© {new Date().getFullYear()} Austin Albert. All rights reserved.</div>
          <div className="uppercase tracking-[0.22em]">Western OK · Red Dirt</div>
        </div>
      </div>
    </footer>
  )
}
