import { useState, useEffect, useRef } from 'react'
import {
  Home, PawPrint, Wrench, Phone, Mail, MapPin,
  Clock, ChevronDown, Menu, X, Shield, Heart,
  Eye, Paintbrush, Droplets, CheckCircle2, ArrowRight,
} from 'lucide-react'

const BASE = import.meta.env.BASE_URL

/* ─── Data ────────────────────────────────────────────── */

const SERVICES_PRIMARY = [
  {
    icon: Home,
    title: 'House Sitting',
    desc: 'Your home stays safe and lived-in while you travel. Mail collection, light management, plant watering, and daily check-ins so you can relax knowing everything is taken care of.',
    features: ['Daily check-ins & photos', 'Mail & package collection', 'Plant & lawn care', 'Light & thermostat management'],
  },
  {
    icon: PawPrint,
    title: 'Pet Sitting',
    desc: 'Your pets stay in the comfort of their own home with familiar surroundings, routines, and plenty of attention. No stressful kennels or unfamiliar places.',
    features: ['In-home care & companionship', 'Feeding & medication schedules', 'Walks & playtime', 'Daily photo updates'],
  },
]

const SERVICES_SECONDARY = [
  {
    icon: Wrench,
    title: 'Small Home Repairs',
    desc: "Squeaky doors, running toilets, sticky locks - the fixes that make a house feel right.",
    features: ['Faucet & toilet repairs', 'Door & cabinet fixes', 'Drywall patching', 'General maintenance'],
  },
  {
    icon: Droplets,
    title: 'Caulking & Sealing',
    desc: 'Bathrooms, kitchens, windows, and exterior gaps resealed to keep water out and energy in.',
    features: ['Bathroom & kitchen resealing', 'Window & door weatherproofing', 'Exterior gap sealing', 'Clean, professional finish'],
  },
  {
    icon: Paintbrush,
    title: 'Touch-Up Work',
    desc: "Scuffed walls, chipped trim, small paint jobs that don't warrant a full crew.",
    features: ['Wall & trim touch-ups', 'Cabinet refinishing', 'Baseboard repair', 'Nail hole patching'],
  },
  {
    icon: Eye,
    title: 'Home Check-Ins',
    desc: "Regular scheduled visits to make sure everything is running smoothly while you're away.",
    features: ['Scheduled walk-throughs', 'Storm & weather checks', 'Appliance monitoring', 'Photo reports sent to you'],
  },
]

const REVIEWS = [
  {
    name: 'Margaret T.',
    text: "Randy watched our house and two dogs for two weeks while we were in Florida. Came home to a clean house, happy pups, and he even fixed the leaky faucet we'd been putting off. Can't recommend him enough.",
  },
  {
    name: 'Jim & Carol W.',
    text: "We've been using Randy for house check-ins every winter when we head south. He sends photos, collects our mail, and always goes above and beyond. It's like having a trusted neighbor with a toolbox.",
  },
  {
    name: 'David R.',
    text: 'Had Randy come out to recaulk both bathrooms and fix a sticky sliding door. Done in half a day, looks great, and the price was more than fair. This is the kind of honest work you just don\'t find anymore.',
  },
  {
    name: 'Susan K.',
    text: "Our cats are very particular about new people, but Randy won them over on the first visit. He follows their routines exactly and sends the sweetest update photos. We won't use anyone else.",
  },
]

const VALUES = [
  { icon: Shield, title: 'Trustworthy', desc: 'Your home is your most important investment. I treat it that way.' },
  { icon: Heart, title: 'Personal Touch', desc: 'Not a franchise. Not an app. Just a real person who cares about doing it right.' },
  { icon: CheckCircle2, title: 'Reliable', desc: 'I show up when I say I will, and I finish what I start. Every time.' },
  { icon: Clock, title: 'Flexible', desc: 'Need a last-minute check-in? A same-week repair? I work around your schedule.' },
]


/* ─── Hooks ───────────────────────────────────────────── */

function useInView(options = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); observer.disconnect() }
    }, { threshold: 0.15, ...options })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return { ref, inView }
}


/* ─── Components ──────────────────────────────────────── */

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const hamburgerRef = useRef(null)

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 40)
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        hamburgerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open])

  const links = [
    { label: 'Services', href: '#services' },
    { label: 'About', href: '#about' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'Contact', href: '#contact' },
  ]

  const handleNav = (href) => {
    setOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-cream/95 backdrop-blur-sm shadow-[0_1px_0_0_oklch(82%_0.03_80)]' : ''}`}>
      <nav className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between" aria-label="Main navigation">
        <a href="#" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          className="font-serif text-xl text-bark tracking-tight">
          Handy Randy's
        </a>

        <ul className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <li key={l.href}>
              <button
                onClick={() => handleNav(l.href)}
                className="text-sm font-medium text-warm-gray hover:text-bark transition-colors py-2 px-1"
              >
                {l.label}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={() => handleNav('#contact')}
              className="text-sm font-semibold px-5 py-2.5 bg-forest text-cream rounded-lg hover:bg-forest-dark transition-colors"
            >
              Get a Quote
            </button>
          </li>
        </ul>

        <button
          ref={hamburgerRef}
          className="md:hidden p-2 text-bark"
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Navigation menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div
          id="mobile-menu"
          role="menu"
          className="md:hidden bg-cream border-t border-sand-dark/50 shadow-lg"
        >
          <ul className="flex flex-col px-5 py-4 gap-1">
            {links.map(l => (
              <li key={l.href} role="none">
                <button
                  role="menuitem"
                  onClick={() => handleNav(l.href)}
                  className="w-full text-left text-sm font-medium text-bark py-2.5 px-3 rounded-lg hover:bg-sand transition-colors"
                >
                  {l.label}
                </button>
              </li>
            ))}
            <li role="none" className="mt-2">
              <button
                role="menuitem"
                onClick={() => handleNav('#contact')}
                className="w-full text-sm font-semibold px-5 py-2.5 bg-forest text-cream rounded-lg hover:bg-forest-dark transition-colors text-center"
              >
                Get a Quote
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}


function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-16">
      {/* Warm radial background */}
      <div className="absolute inset-0 bg-cream" />
      <div className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(ellipse 70% 50% at 70% 40%, oklch(88% 0.03 80 / 0.6), transparent)`,
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-5 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-forest/8 rounded-full w-fit">
              <MapPin size={14} className="text-forest" />
              <span className="text-xs font-semibold text-forest tracking-wide uppercase">Serving the Tulsa Area</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-bark leading-[1.1] tracking-tight">
              Your home in <span className="text-rust italic">good hands</span> while you're away
            </h1>

            <p className="text-warm-gray text-lg leading-relaxed max-w-lg">
              House sitting, pet care, and handyman services from someone you can trust.
              Honest work, fair prices, and the peace of mind you deserve.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-7 py-3.5 bg-forest text-cream font-semibold rounded-lg hover:bg-forest-dark transition-colors text-sm inline-flex items-center justify-center gap-2"
              >
                Get a Free Quote
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-7 py-3.5 border border-sand-dark text-bark font-semibold rounded-lg hover:border-bark/30 transition-colors text-sm"
              >
                See Services
              </button>
            </div>

            {/* Trust line - simple, specific, not generic */}
            <p className="text-xs text-warm-gray mt-4 pt-4 border-t border-sand-dark/40">
              Trusted by families across Tulsa for over 30 years.
            </p>
          </div>

          {/* Photo */}
          <div className="flex justify-center order-first md:order-last">
            <div className="w-48 h-56 sm:w-64 sm:h-72 md:w-80 md:h-96 rounded-2xl overflow-hidden shadow-xl">
              <img
                src={`${BASE}images/randy.jpeg`}
                alt="Randy - Your trusted Tulsa handyman"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


function Services() {
  const { ref, inView } = useInView()

  return (
    <section id="services" className="py-24 px-5 bg-white">
      <div className="max-w-6xl mx-auto">
        <div ref={ref} className="text-center mb-16">
          <p className="text-xs font-semibold text-rust uppercase tracking-widest mb-3">What I Do</p>
          <h2 className="text-3xl sm:text-4xl font-serif text-bark mb-4">Services built around your needs</h2>
          <p className="text-warm-gray max-w-xl mx-auto">
            Whether you need someone to watch the house, look after the pets,
            or knock out that list of small repairs, I've got you covered.
          </p>
        </div>

        {/* Primary services - larger cards */}
        <div className="grid sm:grid-cols-2 gap-5 mb-5">
          {SERVICES_PRIMARY.map((svc, i) => (
            <PrimaryServiceCard key={svc.title} svc={svc} index={i} inView={inView} />
          ))}
        </div>

        {/* Secondary services - smaller compact row */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SERVICES_SECONDARY.map((svc, i) => (
            <SecondaryServiceCard key={svc.title} svc={svc} index={i + 2} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  )
}

function PrimaryServiceCard({ svc, index, inView }) {
  const Icon = svc.icon
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className="bg-cream rounded-xl p-7 border border-sand-dark/30 hover:border-rust/30 transition-all group"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(16px)',
        transition: `opacity 0.5s ${index * 0.08}s, transform 0.5s ${index * 0.08}s`,
      }}
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 bg-forest/8 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-forest/12 transition-colors">
          <Icon size={22} className="text-forest" />
        </div>
        <div>
          <h3 className="font-serif text-xl text-bark mb-1">{svc.title}</h3>
          <p className="text-warm-gray text-sm leading-relaxed">{svc.desc}</p>
        </div>
      </div>

      <button
        onClick={() => setExpanded(e => !e)}
        className="text-xs font-semibold text-forest flex items-center gap-1 hover:text-forest-dark transition-colors py-2"
        aria-expanded={expanded}
      >
        {expanded ? 'Show less' : "What's included"}
        <ChevronDown size={14} className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {expanded && (
        <ul className="mt-1 flex flex-col gap-1.5">
          {svc.features.map(f => (
            <li key={f} className="text-xs text-warm-gray flex items-start gap-2">
              <CheckCircle2 size={13} className="text-forest mt-0.5 flex-shrink-0" />
              {f}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function SecondaryServiceCard({ svc, index, inView }) {
  const Icon = svc.icon
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className="bg-cream rounded-xl p-5 border border-sand-dark/30 hover:border-rust/30 transition-all group"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(12px)',
        transition: `opacity 0.5s ${index * 0.06}s, transform 0.5s ${index * 0.06}s`,
      }}
    >
      <div className="w-9 h-9 bg-forest/8 rounded-lg flex items-center justify-center mb-3 group-hover:bg-forest/12 transition-colors">
        <Icon size={17} className="text-forest" />
      </div>
      <h3 className="font-serif text-base text-bark mb-1.5">{svc.title}</h3>
      <p className="text-warm-gray text-xs leading-relaxed mb-3">{svc.desc}</p>

      <button
        onClick={() => setExpanded(e => !e)}
        className="text-xs font-semibold text-forest flex items-center gap-1 hover:text-forest-dark transition-colors py-2"
        aria-expanded={expanded}
      >
        {expanded ? 'Less' : 'Details'}
        <ChevronDown size={12} className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {expanded && (
        <ul className="mt-1 flex flex-col gap-1">
          {svc.features.map(f => (
            <li key={f} className="text-[11px] text-warm-gray flex items-start gap-1.5">
              <CheckCircle2 size={11} className="text-forest mt-0.5 flex-shrink-0" />
              {f}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}


function About() {
  const { ref, inView } = useInView()

  return (
    <section id="about" className="py-24 px-5 bg-bark">
      <div className="max-w-6xl mx-auto">
        <div
          ref={ref}
          className="grid md:grid-cols-2 gap-12 items-center"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s, transform 0.6s',
          }}
        >
          {/* Photo */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-72 sm:w-80 aspect-square rounded-2xl overflow-hidden">
                <img
                  src={`${BASE}images/randy.jpeg`}
                  alt="Randy with his son - a family tradition of hard work"
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10" />
            </div>
          </div>

          {/* Text */}
          <div className="flex flex-col gap-5">
            <p className="text-xs font-semibold text-rust-light uppercase tracking-widest">About Randy</p>
            <h2 className="text-3xl sm:text-4xl font-serif text-cream leading-snug">
              A handyman you can actually trust with your keys
            </h2>
            <div className="flex flex-col gap-4 text-warm-gray-light text-sm leading-relaxed">
              <p>
                I've been fixing things, building things, and taking care of homes for over 30 years.
                What started as helping out neighbors turned into a calling. There's nothing more
                satisfying than walking away from a job knowing someone's home is better than I found it.
              </p>
              <p>
                I'm not a big company. There's no call center, no scheduling software, no upsells.
                When you call Handy Randy's, you get me. I show up on time, I do honest work,
                and I charge what's fair. That's how my dad did it, and that's how I do it.
              </p>
              <p>
                Whether you need someone to watch the house while you visit the grandkids, keep
                your dog company while you're on a work trip, or finally fix that list of small
                things you've been putting off - I'm your guy.
              </p>
            </div>

            {/* Values */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {VALUES.map(v => {
                const Icon = v.icon
                return (
                  <div key={v.title} className="flex items-start gap-3 bg-bark-light/60 rounded-lg p-3.5">
                    <Icon size={16} className="text-rust-light mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-cream text-xs font-semibold">{v.title}</p>
                      <p className="text-warm-gray-light text-[11px] leading-snug mt-0.5">{v.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


function Reviews() {
  const { ref, inView } = useInView()

  return (
    <section id="reviews" className="py-24 px-5 bg-cream">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold text-rust uppercase tracking-widest mb-3">Kind Words</p>
          <h2 className="text-3xl sm:text-4xl font-serif text-bark">What Tulsa homeowners are saying</h2>
        </div>

        <div
          ref={ref}
          className="grid sm:grid-cols-2 gap-5 max-w-4xl mx-auto"
        >
          {REVIEWS.map((review, i) => (
            <div
              key={review.name}
              className="bg-white rounded-xl p-6 border border-sand-dark/30"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(16px)',
                transition: `opacity 0.5s ${i * 0.1}s, transform 0.5s ${i * 0.1}s`,
              }}
            >
              <p className="text-bark/80 text-sm leading-relaxed mb-5">"{review.text}"</p>
              <p className="text-xs font-semibold text-bark">{review.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


function Contact() {
  const { ref, inView } = useInView()

  return (
    <section id="contact" className="py-24 px-5 bg-white">
      <div className="max-w-3xl mx-auto">
        <div
          ref={ref}
          className="text-center mb-12"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.5s, transform 0.5s',
          }}
        >
          <p className="text-xs font-semibold text-rust uppercase tracking-widest mb-3">Let's Talk</p>
          <h2 className="text-3xl sm:text-4xl font-serif text-bark mb-4">Ready to get started?</h2>
          <p className="text-warm-gray max-w-lg mx-auto">
            Give me a call or send a message. I'll get back to you within a few hours
            to discuss what you need and set up a time that works.
          </p>
        </div>

        <div
          className="grid sm:grid-cols-2 gap-5"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.5s 0.2s, transform 0.5s 0.2s',
          }}
        >
          {/* Phone card */}
          <a
            href="tel:+19185551234"
            className="flex items-center gap-4 bg-forest rounded-xl p-6 text-cream hover:bg-forest-dark transition-colors group"
          >
            <div className="w-12 h-12 bg-white/15 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <Phone size={22} className="text-cream" />
            </div>
            <div>
              <p className="text-xs text-cream/70 mb-0.5">Call or Text</p>
              <p className="text-lg font-semibold">(918) 555-1234</p>
            </div>
          </a>

          {/* Email card */}
          <a
            href="mailto:randy@handyrandys.com"
            className="flex items-center gap-4 bg-cream rounded-xl p-6 border border-sand-dark/30 hover:border-rust/30 transition-colors group"
          >
            <div className="w-12 h-12 bg-forest/8 rounded-lg flex items-center justify-center group-hover:bg-forest/12 transition-colors">
              <Mail size={22} className="text-forest" />
            </div>
            <div>
              <p className="text-xs text-warm-gray mb-0.5">Email</p>
              <p className="text-bark font-semibold">randy@handyrandys.com</p>
            </div>
          </a>
        </div>

        {/* Service area */}
        <div
          className="mt-8 bg-cream rounded-xl p-6 border border-sand-dark/30 text-center"
          style={{
            opacity: inView ? 1 : 0,
            transition: 'opacity 0.5s 0.35s',
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <MapPin size={16} className="text-forest" />
            <p className="text-sm font-semibold text-bark">Service Area</p>
          </div>
          <p className="text-warm-gray text-sm">
            Tulsa, Broken Arrow, Owasso, Jenks, Bixby, Sand Springs, and surrounding areas.
          </p>
        </div>
      </div>
    </section>
  )
}


function CTA() {
  return (
    <section className="py-20 px-5 bg-rust">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-serif text-cream mb-4">
          Going out of town? Got a to-do list?
        </h2>
        <p className="text-cream/80 mb-8 max-w-lg mx-auto">
          Whether it's a weekend trip or a month-long vacation,
          your home and pets are in good hands.
        </p>
        <button
          onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          className="px-8 py-3.5 bg-cream text-bark font-semibold rounded-lg hover:bg-white transition-colors text-sm inline-flex items-center gap-2"
        >
          Get Your Free Quote
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  )
}


function Footer() {
  return (
    <footer className="py-10 px-5 bg-bark">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-serif text-cream text-lg">Handy Randy's</p>
          <p className="text-warm-gray text-xs mt-1">Tulsa's trusted home & pet care</p>
        </div>
        <p className="text-warm-gray text-xs">
          Serving the greater Tulsa area with honest work and fair prices.
        </p>
      </div>
    </footer>
  )
}


/* ─── App ─────────────────────────────────────────────── */

export default function App() {
  return (
    <>
      <a href="#services" className="absolute -top-10 left-4 z-[100] px-4 py-2 bg-forest text-cream text-sm font-semibold rounded-b-lg focus:top-0 transition-[top] duration-200">
        Skip to content
      </a>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <About />
        <CTA />
        <Reviews />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
