import { useState, useEffect } from 'react'
import {
  Menu, X, ChevronUp, MapPin, Mail, Phone, Droplets,
  TreePine, Heart, Award, ShoppingBag, Truck, Star,
  MessageSquareQuote, ArrowRight,
} from 'lucide-react'

const BASE = import.meta.env.BASE_URL

/* ── Data ── */

const NAV_LINKS = [
  { label: 'Our Honey', href: '#products' },
  { label: 'About', href: '#about' },
  { label: 'Process', href: '#process' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Contact', href: '#contact' },
]

const PRODUCTS = [
  {
    icon: Droplets,
    name: 'Wildflower Honey',
    desc: 'Our signature raw wildflower honey - unfiltered, unpasteurized, and bursting with natural flavor from local wildflower blooms.',
    tag: 'Best Seller',
  },
  {
    icon: TreePine,
    name: 'Seasonal Harvest',
    desc: 'Limited seasonal varieties that capture the unique nectar flows of spring clover, summer sunflower, and autumn goldenrod.',
    tag: 'Seasonal',
  },
  {
    icon: Heart,
    name: 'Creamed Honey',
    desc: 'Smooth, spreadable honey with a velvety texture - perfect on toast, biscuits, or straight from the jar.',
    tag: 'Popular',
  },
  {
    icon: Award,
    name: 'Raw Honeycomb',
    desc: 'Pure comb honey cut fresh from our frames. A delicious, all-natural treat and a beautiful addition to any charcuterie board.',
    tag: 'Premium',
  },
  {
    icon: ShoppingBag,
    name: 'Gift Sets',
    desc: 'Curated honey gift boxes featuring a selection of our favorites - ideal for holidays, housewarmings, and special occasions.',
    tag: 'Gift',
  },
  {
    icon: Truck,
    name: 'Local Pickup & Delivery',
    desc: 'Order online and pick up fresh honey at our farm or select local markets. Local delivery available for larger orders.',
    tag: 'Convenient',
  },
]

const PROCESS_STEPS = [
  { step: '01', title: 'Happy Bees', desc: 'Our hives are placed in pesticide-free meadows and wildflower fields where bees forage naturally on diverse, local flora.' },
  { step: '02', title: 'Hand Harvested', desc: 'We carefully harvest only the surplus honey, leaving plenty for the bees. Every frame is inspected and handled with care.' },
  { step: '03', title: 'Minimally Processed', desc: 'Our honey is gently strained to remove wax, never heated or ultra-filtered, preserving all the natural enzymes and pollen.' },
  { step: '04', title: 'Jar to Table', desc: 'Bottled in small batches and labeled by harvest date so you always know exactly when your honey was made.' },
]

const REVIEWS = [
  { name: 'Sarah M.', text: 'The best honey I have ever tasted. You can really taste the difference compared to store-bought. My kids love it on everything!', rating: 5 },
  { name: 'James R.', text: 'We have been buying from Haugh Honey for two years now and will never go back. The wildflower honey is incredible, and the honeycomb is a must-try.', rating: 5 },
  { name: 'Linda K.', text: 'Ordered the gift set for Christmas and it was a huge hit. Beautiful packaging, amazing honey. Will definitely be ordering again.', rating: 5 },
]

/* ── SVG Logo Component ── */

function HawkBeeLogo({ className = '', size = 48 }) {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Sky circle background */}
      <circle cx="100" cy="100" r="95" fill="#fffbeb" stroke="#d4930d" strokeWidth="3" />

      {/* Hawk - sweeping in from upper left */}
      <g transform="translate(30, 35) rotate(-15, 60, 50)">
        {/* Body */}
        <ellipse cx="60" cy="50" rx="35" ry="14" fill="#5d4037" />
        {/* Head */}
        <circle cx="95" cy="44" r="11" fill="#3e2723" />
        {/* Eye */}
        <circle cx="99" cy="42" r="2.5" fill="#f59e0b" />
        <circle cx="100" cy="41.5" r="1" fill="#1b0f0b" />
        {/* Beak */}
        <polygon points="106,44 114,46 106,48" fill="#d4930d" />
        {/* Wing - swept back */}
        <path d="M55,42 Q30,15 10,25 Q25,30 35,38 Z" fill="#3e2723" opacity="0.9" />
        <path d="M50,46 Q20,28 5,40 Q22,38 38,44 Z" fill="#5d4037" opacity="0.8" />
        {/* Tail feathers */}
        <path d="M25,50 Q10,45 5,55 Q15,52 25,54 Z" fill="#3e2723" opacity="0.7" />
        <path d="M25,52 Q8,52 3,62 Q14,56 25,56 Z" fill="#5d4037" opacity="0.6" />
        {/* Talons reaching forward */}
        <path d="M88,58 Q95,65 100,62" stroke="#d4930d" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M85,60 Q90,68 96,66" stroke="#d4930d" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M90,57 Q98,60 104,58" stroke="#d4930d" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* Chest detail */}
        <ellipse cx="75" cy="52" rx="12" ry="8" fill="#795548" opacity="0.6" />
      </g>

      {/* Bee - lower right, fleeing */}
      <g transform="translate(125, 110)">
        {/* Wings */}
        <ellipse cx="22" cy="8" rx="12" ry="7" fill="#fffbeb" stroke="#d4930d" strokeWidth="0.8" opacity="0.7" transform="rotate(-20, 22, 8)" />
        <ellipse cx="18" cy="5" rx="10" ry="6" fill="#fffbeb" stroke="#d4930d" strokeWidth="0.8" opacity="0.7" transform="rotate(-35, 18, 5)" />
        {/* Body */}
        <ellipse cx="25" cy="20" rx="14" ry="9" fill="#f59e0b" />
        {/* Stripes */}
        <rect x="16" y="16" width="18" height="3" rx="1.5" fill="#1b0f0b" />
        <rect x="17" y="22" width="16" height="3" rx="1.5" fill="#1b0f0b" />
        {/* Head */}
        <circle cx="40" cy="20" r="6" fill="#1b0f0b" />
        {/* Eye */}
        <circle cx="43" cy="18" r="1.5" fill="#f59e0b" />
        {/* Antennae */}
        <path d="M44,14 Q48,8 50,6" stroke="#1b0f0b" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        <path d="M43,15 Q45,9 44,5" stroke="#1b0f0b" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        <circle cx="50" cy="5.5" r="1.2" fill="#1b0f0b" />
        <circle cx="44" cy="4.5" r="1.2" fill="#1b0f0b" />
        {/* Stinger */}
        <polygon points="11,20 5,18 5,22" fill="#1b0f0b" />
        {/* Motion lines */}
        <line x1="0" y1="15" x2="-8" y2="14" stroke="#d4930d" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
        <line x1="2" y1="20" x2="-7" y2="20" stroke="#d4930d" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
        <line x1="1" y1="25" x2="-6" y2="26" stroke="#d4930d" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
      </g>

      {/* Small honeycomb accent - bottom left */}
      <g transform="translate(25, 150)" opacity="0.3">
        <polygon points="10,0 18,5 18,15 10,20 2,15 2,5" fill="none" stroke="#d4930d" strokeWidth="1.5" />
        <polygon points="26,0 34,5 34,15 26,20 18,15 18,5" fill="none" stroke="#d4930d" strokeWidth="1.5" />
        <polygon points="18,20 26,25 26,35 18,40 10,35 10,25" fill="none" stroke="#d4930d" strokeWidth="1.5" />
      </g>
    </svg>
  )
}

/* ── Honeycomb Background Pattern ── */

function HoneycombBg({ className = '' }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <svg width="100%" height="100%" className="opacity-[0.04]">
        <defs>
          <pattern id="honeycomb" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(1.5)">
            <path d="M28,2 L50,18 L50,50 L28,66 L6,50 L6,18 Z" fill="none" stroke="#d4930d" strokeWidth="1" />
            <path d="M28,68 L50,84 L50,116 L28,132 L6,116 L6,84 Z" fill="none" stroke="#d4930d" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#honeycomb)" />
      </svg>
    </div>
  )
}

/* ── Navbar ── */

function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur shadow-md' : 'bg-transparent'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 md:h-20">
        <a href="#" className="flex items-center gap-2 no-underline">
          <HawkBeeLogo size={40} />
          <span className={`text-xl font-bold font-['Playfair_Display'] transition-colors ${scrolled ? 'text-bark' : 'text-white'}`}>
            Haugh Honey
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`text-sm font-medium no-underline transition-colors ${scrolled ? 'text-bark-light hover:text-honey' : 'text-white/90 hover:text-honey-light'}`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className="bg-honey text-white text-sm font-semibold px-5 py-2 rounded-full no-underline hover:bg-honey-dark transition-colors"
          >
            Order Now
          </a>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className={`md:hidden cursor-pointer bg-transparent border-none ${scrolled ? 'text-bark' : 'text-white'}`}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-honey-pale shadow-lg">
          <div className="px-4 py-4 space-y-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block text-bark font-medium no-underline hover:text-honey transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="block bg-honey text-white text-center font-semibold px-5 py-2.5 rounded-full no-underline hover:bg-honey-dark transition-colors"
            >
              Order Now
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}

/* ── Hero ── */

function Hero() {
  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-bark-dark via-bark to-bark-light">
      {/* Overlay pattern */}
      <HoneycombBg />

      {/* Decorative honey drip accent */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-honey-dark via-honey to-honey-light" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-24 md:py-0 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-honey/20 text-honey-light text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <MapPin className="w-4 h-4" />
              Locally Sourced - Naturally Pure
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Pure, Raw Honey<br />
              <span className="text-honey-light">From Our Hives</span><br />
              to Your Table
            </h1>
            <p className="text-white/70 text-lg max-w-lg mb-8 leading-relaxed">
              Family-owned beekeeping operation producing small-batch, raw honey
              the way nature intended - no additives, no shortcuts, just pure golden goodness.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#products"
                className="inline-flex items-center gap-2 bg-honey text-white font-semibold px-7 py-3 rounded-full no-underline hover:bg-honey-dark transition-colors text-base"
              >
                Shop Our Honey
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#about"
                className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-semibold px-7 py-3 rounded-full no-underline hover:border-honey-light hover:text-honey-light transition-colors text-base"
              >
                Our Story
              </a>
            </div>
          </div>

          {/* Logo display */}
          <div className="hidden md:flex justify-center">
            <div className="relative">
              <div className="absolute -inset-8 bg-honey/10 rounded-full blur-3xl" />
              <HawkBeeLogo size={320} className="relative drop-shadow-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" className="w-full">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#fffbeb" />
        </svg>
      </div>
    </section>
  )
}

/* ── Products ── */

function Products() {
  return (
    <section id="products" className="bg-warm py-16 md:py-24 relative">
      <HoneycombBg />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-honey font-semibold text-sm uppercase tracking-wider">What We Offer</span>
          <h2 className="text-3xl md:text-4xl font-bold text-bark mt-2 mb-4">Our Honey Products</h2>
          <p className="text-bark-light/70 max-w-2xl mx-auto">
            Every jar of Haugh Honey is produced in small batches with care and attention.
            From raw wildflower to seasonal specialties, there is something for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCTS.map((product) => (
            <div
              key={product.name}
              className="group bg-white rounded-2xl border border-honey-pale p-6 hover:shadow-lg hover:shadow-honey/10 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-honey-pale rounded-xl flex items-center justify-center group-hover:bg-honey group-hover:text-white transition-colors">
                  <product.icon className="w-6 h-6 text-honey group-hover:text-white transition-colors" />
                </div>
                <span className="text-xs font-semibold text-honey bg-honey-pale px-2.5 py-1 rounded-full">
                  {product.tag}
                </span>
              </div>
              <h3 className="text-lg font-bold text-bark mb-2 font-['Playfair_Display']">{product.name}</h3>
              <p className="text-bark-light/70 text-sm leading-relaxed">{product.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── About ── */

function About() {
  return (
    <section id="about" className="bg-white py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Image / Logo side */}
          <div className="relative">
            <div className="bg-gradient-to-br from-honey-pale to-warm rounded-2xl p-8 flex items-center justify-center min-h-[360px]">
              <HawkBeeLogo size={240} />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-honey text-white px-5 py-3 rounded-xl shadow-lg">
              <span className="text-2xl font-bold font-['Playfair_Display']">Est. 2024</span>
            </div>
          </div>

          {/* Text side */}
          <div>
            <span className="text-honey font-semibold text-sm uppercase tracking-wider">Our Story</span>
            <h2 className="text-3xl md:text-4xl font-bold text-bark mt-2 mb-6">
              A Family Passion<br />for Beekeeping
            </h2>
            <p className="text-bark-light/80 leading-relaxed mb-4">
              What started as a fascination with honeybees quickly grew into a full-blown passion.
              At Haugh Honey, we believe in sustainable beekeeping practices that put the health
              of our bees first, because healthy bees make the best honey.
            </p>
            <p className="text-bark-light/80 leading-relaxed mb-6">
              Our hives are kept in carefully chosen locations rich in wildflowers and natural
              forage. We never use chemicals in our hives, and our honey is always raw and
              minimally processed to preserve all the natural benefits and flavors.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-honey-pale rounded-xl p-4 text-center">
                <span className="block text-2xl font-bold text-honey font-['Playfair_Display']">100%</span>
                <span className="text-bark-light text-sm">Raw & Natural</span>
              </div>
              <div className="bg-honey-pale rounded-xl p-4 text-center">
                <span className="block text-2xl font-bold text-honey font-['Playfair_Display']">Local</span>
                <span className="text-bark-light text-sm">Small Batch</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Process ── */

function Process() {
  return (
    <section id="process" className="bg-bark py-16 md:py-24 relative overflow-hidden">
      <HoneycombBg className="opacity-[0.03]" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-honey-light font-semibold text-sm uppercase tracking-wider">From Hive to Jar</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">Our Process</h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            We take pride in every step, from tending our bees to bottling the finished product.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROCESS_STEPS.map((item) => (
            <div key={item.step} className="bg-bark-light/50 border border-white/10 rounded-2xl p-6 hover:border-honey/40 transition-colors">
              <span className="text-4xl font-bold text-honey/30 font-['Playfair_Display']">{item.step}</span>
              <h3 className="text-lg font-bold text-white mt-3 mb-2 font-['Playfair_Display']">{item.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Reviews ── */

function ReviewsSection() {
  return (
    <section id="reviews" className="bg-warm py-16 md:py-24 relative">
      <HoneycombBg />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-honey font-semibold text-sm uppercase tracking-wider">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-bold text-bark mt-2 mb-4">What Our Customers Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((review, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-honey-pale p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <MessageSquareQuote className="w-8 h-8 text-honey/30 mb-3" />
              <div className="flex gap-0.5 mb-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${s <= review.rating ? 'text-honey fill-honey' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <p className="text-bark-light/80 text-sm leading-relaxed mb-4">"{review.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-honey-pale rounded-full flex items-center justify-center">
                  <span className="text-honey font-bold text-sm">{review.name.charAt(0)}</span>
                </div>
                <span className="font-semibold text-bark text-sm">{review.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Contact / CTA ── */

function Contact() {
  return (
    <section id="contact" className="bg-white py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-bark via-bark-dark to-bark rounded-3xl p-8 md:p-14 relative overflow-hidden">
          <HoneycombBg />
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-honey-dark via-honey to-honey-light" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Taste<br />the Difference?
              </h2>
              <p className="text-white/70 leading-relaxed mb-8">
                Whether you want to stock up on your favorite variety, place a bulk order,
                or just ask a question about our bees, we would love to hear from you.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-honey/20 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-honey-light" />
                  </div>
                  <div>
                    <p className="text-white/50 text-xs">Email Us</p>
                    <a href="mailto:info@haughhoney.com" className="text-white font-medium no-underline hover:text-honey-light transition-colors">
                      info@haughhoney.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-honey/20 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-honey-light" />
                  </div>
                  <div>
                    <p className="text-white/50 text-xs">Call or Text</p>
                    <a href="tel:+19185550000" className="text-white font-medium no-underline hover:text-honey-light transition-colors">
                      (918) 555-0000
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-honey/20 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-honey-light" />
                  </div>
                  <div>
                    <p className="text-white/50 text-xs">Location</p>
                    <span className="text-white font-medium">Tulsa, Oklahoma</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute -inset-6 bg-honey/10 rounded-full blur-2xl" />
                <HawkBeeLogo size={200} className="relative" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Scroll to Top ── */

function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-40 w-11 h-11 bg-honey text-white rounded-full shadow-lg flex items-center justify-center hover:bg-honey-dark transition-colors cursor-pointer border-none"
      aria-label="Scroll to top"
    >
      <ChevronUp className="w-5 h-5" />
    </button>
  )
}

/* ── Footer ── */

function Footer() {
  return (
    <footer className="bg-bark-dark py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <HawkBeeLogo size={28} />
            <span className="text-white font-semibold font-['Playfair_Display']">Haugh Honey</span>
          </div>
          <p className="text-white/40 text-sm text-center">
            &copy; {new Date().getFullYear()} Haugh Honey. All rights reserved. Tulsa, Oklahoma.
          </p>
          <div className="flex items-center gap-4 text-white/40 text-sm">
            <a href="tel:+19185550000" className="hover:text-honey-light no-underline text-white/40 transition-colors">(918) 555-0000</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ── App ── */

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Products />
      <About />
      <Process />
      <ReviewsSection />
      <Contact />
      <Footer />
      <ScrollToTop />
    </div>
  )
}
