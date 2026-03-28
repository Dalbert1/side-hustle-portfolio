import { useState, useEffect } from 'react'
import {
  Phone, Mail, MapPin, Menu, X, Hammer, Home, Fence,
  PaintBucket, Wrench, Frame, ChevronRight, Star, ArrowUp,
  MessageSquareQuote
} from 'lucide-react'

function FacebookIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

const BASE = import.meta.env.BASE_URL

const NAV_LINKS = [
  { href: '#services', label: 'Services' },
  { href: '#gallery', label: 'Our Work' },
  { href: '#reviews', label: 'Reviews' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]

const SERVICES = [
  { icon: Home, title: 'New Builds', desc: 'Custom homes and structures built from the ground up to your exact specifications.' },
  { icon: PaintBucket, title: 'Interior Remodels', desc: 'Kitchens, bathrooms, flooring, countertops, and full interior renovations.' },
  { icon: Hammer, title: 'Exterior Remodels', desc: 'Siding, roofing, porches, and exterior upgrades that transform your property.' },
  { icon: Frame, title: 'Framing', desc: 'Residential and commercial framing for new construction and additions.' },
  { icon: Fence, title: 'Fencing', desc: 'Custom wood, metal, and privacy fencing built to last in Oklahoma weather.' },
  { icon: Wrench, title: 'Welding', desc: 'Structural and custom welding for gates, handrails, brackets, and more.' },
]

const REVIEWS = [
  { name: 'Satisfied Customer', stars: 5, text: 'Heeler Construction did an amazing job on our kitchen remodel. Professional, on time, and the quality of work was outstanding. Highly recommend!' },
  { name: 'Local Homeowner', stars: 5, text: 'Had them build a custom fence for our property. It looks incredible and was done faster than expected. Fair pricing and great communication throughout.' },
  { name: 'Western OK Resident', stars: 5, text: 'From the initial estimate to the finished product, everything was top-notch. These guys take real pride in their work. Will definitely use them again.' },
]

const GALLERY = [
  { src: `${BASE}images/477772362_589423220576658_4900997438430826589_n.jpg`, alt: 'New build framing with loft and staircase', caption: 'New Build Framing' },
  { src: `${BASE}images/478061954_589436863908627_8861068102649833666_n.jpg`, alt: 'Custom horizontal privacy fence', caption: 'Custom Privacy Fence' },
  { src: `${BASE}images/479730051_589422870576693_7359755675010074271_n.jpg`, alt: 'Kitchen sink and countertop remodel', caption: 'Kitchen Remodel' },
]

function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-navy-dark/95 backdrop-blur fixed top-0 w-full z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <a href="#" className="flex items-center gap-3 no-underline">
            <img src={`${BASE}images/logo.jpg`} alt="Heeler Construction" className="w-10 h-10 rounded" />
            <div className="text-white font-bold text-lg leading-tight">
              Heeler<span className="text-accent"> Construction</span>
            </div>
          </a>

          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="text-sm font-medium text-gray-300 hover:text-white no-underline transition-colors">
                {link.label}
              </a>
            ))}
            <a href="https://www.facebook.com/HeelerConstructionWelding/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors" aria-label="Facebook">
              <FacebookIcon className="w-5 h-5" />
            </a>
            <a href="tel:5807999191" className="bg-accent hover:bg-accent-light text-white px-4 py-2 rounded-lg text-sm font-semibold no-underline transition-colors">
              Call Now
            </a>
          </div>

          <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-gray-300 hover:text-white" aria-label="Toggle menu">
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-4 border-t border-white/10">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="block py-3 px-2 text-sm font-medium text-gray-300 no-underline">
                {link.label}
              </a>
            ))}
            <a href="https://www.facebook.com/HeelerConstructionWelding/" target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} className="flex items-center gap-2 py-3 px-2 text-sm font-medium text-gray-300 no-underline">
              <FacebookIcon className="w-4 h-4" /> Facebook
            </a>
            <a href="tel:5807999191" onClick={() => setOpen(false)} className="block mt-2 bg-accent text-white text-center px-4 py-2 rounded-lg text-sm font-semibold no-underline">
              Call 580-799-9191
            </a>
          </div>
        )}
      </div>
    </nav>
  )
}

function Hero() {
  return (
    <section className="relative bg-navy-dark pt-16 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 L55 30 L30 55 L5 30Z' stroke='white' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-accent" />
              <span className="text-accent text-sm font-semibold tracking-wider uppercase">Elk City, Oklahoma</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
              Building Western Oklahoma
              <span className="text-accent"> Right.</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed max-w-lg">
              From new builds to remodels, framing to fencing -- Heeler Construction & Welding delivers
              quality craftsmanship you can count on. Licensed, insured, and locally owned.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="tel:5807999191" className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-light text-white font-bold px-6 py-3.5 rounded-xl text-base no-underline transition-colors">
                <Phone className="w-5 h-5" />
                580-799-9191
              </a>
              <a href="#services" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3.5 rounded-xl text-base no-underline transition-colors backdrop-blur border border-white/20">
                View Services
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 rotate-1 hover:rotate-0 transition-transform duration-500">
              <img
                src={`${BASE}images/477772362_589423220576658_4900997438430826589_n.jpg`}
                alt="Heeler Construction new build framing"
                className="w-full h-80 object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 rounded-xl overflow-hidden shadow-xl border-4 border-navy-dark w-48 -rotate-3 hover:rotate-0 transition-transform duration-500">
              <img
                src={`${BASE}images/478061954_589436863908627_8861068102649833666_n.jpg`}
                alt="Custom fence work"
                className="w-full h-32 object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Angled divider */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }} />
    </section>
  )
}

function Services() {
  return (
    <section id="services" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-accent font-semibold text-sm tracking-wider uppercase">What We Do</span>
          <h2 className="text-3xl md:text-4xl font-bold text-navy mt-2">Our Services</h2>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
            We handle projects big and small across Western Oklahoma. If it involves building, remodeling, or welding -- we have got you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service) => (
            <div key={service.title} className="group p-6 bg-warm rounded-xl border border-warm-dark hover:border-accent/30 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-lg bg-navy flex items-center justify-center mb-4 group-hover:bg-accent transition-colors">
                <service.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-navy mb-2">{service.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Gallery() {
  const [selected, setSelected] = useState(null)

  return (
    <section id="gallery" className="py-16 md:py-24 bg-warm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-accent font-semibold text-sm tracking-wider uppercase">Portfolio</span>
          <h2 className="text-3xl md:text-4xl font-bold text-navy mt-2">Our Work</h2>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
            See what Heeler Construction has built across Western Oklahoma.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GALLERY.map((item, i) => (
            <button
              key={i}
              onClick={() => setSelected(item)}
              className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer bg-transparent border-none p-0"
            >
              <img src={item.src} alt={item.alt} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-left opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white font-semibold text-sm">{item.caption}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Lightbox */}
        {selected && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-white hover:text-accent cursor-pointer bg-transparent border-none">
              <X className="w-8 h-8" />
            </button>
            <img src={selected.src} alt={selected.alt} className="max-w-full max-h-[85vh] rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()} />
          </div>
        )}
      </div>
    </section>
  )
}

function Reviews() {
  return (
    <section id="reviews" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-accent font-semibold text-sm tracking-wider uppercase">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-bold text-navy mt-2">What People Are Saying</h2>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
            Don't just take our word for it. See what our customers have to say about working with Heeler Construction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((review, i) => (
            <div key={i} className="bg-warm rounded-xl p-6 border border-warm-dark relative">
              <MessageSquareQuote className="w-8 h-8 text-accent/20 absolute top-4 right-4" />
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: review.stars }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-accent fill-accent" />
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">"{review.text}"</p>
              <div className="text-navy font-semibold text-sm">{review.name}</div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href="https://www.facebook.com/HeelerConstructionWelding/reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-accent hover:text-accent-light font-semibold text-sm no-underline transition-colors"
          >
            <FacebookIcon className="w-4 h-4" />
            See More Reviews on Facebook
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section id="about" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src={`${BASE}images/471201290_562700539909092_4606000884168691823_n.jpg`}
              alt="Heeler Construction & Welding"
              className="rounded-xl shadow-lg w-full max-w-md mx-auto"
            />
          </div>
          <div>
            <span className="text-accent font-semibold text-sm tracking-wider uppercase">About Us</span>
            <h2 className="text-3xl md:text-4xl font-bold text-navy mt-2 mb-6">
              Western Oklahoma's Construction & Welding Professionals
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Heeler Construction LLC is a locally owned and operated construction and welding company based
              out of Elk City, Oklahoma. We take pride in delivering quality work at fair prices throughout
              Western Oklahoma.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Whether you need a full custom home build, a kitchen remodel, a new fence, or custom welding work --
              we bring the same level of dedication and craftsmanship to every job. No project is too big or too small.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { num: '100+', label: 'Projects Completed' },
                { num: '5', label: 'Star Reviews' },
              ].map((stat) => (
                <div key={stat.label} className="bg-warm rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-navy">{stat.num}</div>
                  <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section id="contact" className="py-16 md:py-24 bg-navy-dark relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='1.5' fill='white'/%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-accent font-semibold text-sm tracking-wider uppercase">Get In Touch</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">Ready to Build?</h2>
          <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
            Give us a call or send an email. We would love to hear about your project and provide a free estimate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <a href="tel:5807999191" className="group flex flex-col items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-6 no-underline transition-colors">
            <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
              <Phone className="w-6 h-6 text-accent" />
            </div>
            <div className="text-white font-semibold">Call Us</div>
            <div className="text-gray-400 text-sm">580-799-9191</div>
          </a>

          <a href="mailto:Heelerconstructionllc@gmail.com" className="group flex flex-col items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-6 no-underline transition-colors">
            <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
              <Mail className="w-6 h-6 text-accent" />
            </div>
            <div className="text-white font-semibold">Email Us</div>
            <div className="text-gray-400 text-sm text-center break-all">Heelerconstructionllc @gmail.com</div>
          </a>

          <div className="flex flex-col items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-accent" />
            </div>
            <div className="text-white font-semibold">Location</div>
            <div className="text-gray-400 text-sm text-center">Elk City, OK<br />Western Oklahoma</div>
          </div>
        </div>

        <div className="text-center mt-10">
          <a href="tel:5807999191" className="inline-flex items-center gap-2 bg-accent hover:bg-accent-light text-white font-bold px-8 py-4 rounded-xl text-lg no-underline transition-colors">
            <Phone className="w-5 h-5" />
            Give Us a Call
          </a>
        </div>
      </div>
    </section>
  )
}

function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-40 w-12 h-12 bg-accent hover:bg-accent-light text-white rounded-full shadow-lg flex items-center justify-center transition-colors cursor-pointer border-none"
      aria-label="Scroll to top"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  )
}

function Footer() {
  return (
    <footer className="bg-navy-dark border-t border-white/10 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={`${BASE}images/logo.jpg`} alt="Heeler Construction" className="w-8 h-8 rounded" />
            <span className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Heeler Construction LLC. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-4 text-gray-500 text-sm">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Elk City, OK
            </span>
            <a href="tel:5807999191" className="flex items-center gap-1 text-gray-500 hover:text-accent no-underline transition-colors">
              <Phone className="w-3.5 h-3.5" /> 580-799-9191
            </a>
            <a href="https://www.facebook.com/HeelerConstructionWelding/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-gray-500 hover:text-accent no-underline transition-colors">
              <FacebookIcon className="w-3.5 h-3.5" /> Facebook
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Services />
      <Gallery />
      <Reviews />
      <About />
      <Contact />
      <Footer />
      <ScrollToTop />
    </div>
  )
}
