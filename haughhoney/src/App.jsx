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
      viewBox="0 0 240 200"
      width={size}
      height={size * (200/240)}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Badge */}
      <rect x="3" y="3" width="234" height="194" rx="20" fill="#fffbeb" stroke="#d4930d" strokeWidth="3" />

      {/* === HAWK - side view diving right, chasing the bee === */}
      <g transform="translate(22, 18)">

        {/* ── WING - swept back, layered feathers ── */}
        <path d="M62,30 Q30,5 4,0 Q0,12 -2,26 Q0,38 6,48 Q32,40 60,52 Z" fill="#3e2723" />
        {/* Primary feather tips */}
        <path d="M62,26 Q32,2 6,-2" stroke="#1b0f0b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M60,32 Q30,12 2,10" stroke="#1b0f0b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M58,38 Q28,22 0,24" stroke="#1b0f0b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M56,44 Q28,32 2,38" stroke="#1b0f0b" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <path d="M54,50 Q30,42 8,48" stroke="#1b0f0b" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Feather tip separations */}
        <path d="M6,-2 L2,-6" stroke="#1b0f0b" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M2,10 L-3,8" stroke="#1b0f0b" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M0,24 L-4,23" stroke="#1b0f0b" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M2,38 L-2,38" stroke="#1b0f0b" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        {/* Secondary layer */}
        <path d="M64,38 Q42,30 18,40 Q10,46 6,52 Q28,48 52,54 Q60,48 64,42 Z" fill="#5d4037" />
        <path d="M66,46 Q48,42 30,50 Q45,50 62,54 Q66,50 66,48 Z" fill="#795548" opacity="0.5" />
        {/* Feather vein lines */}
        <path d="M44,18 Q24,6 10,4" stroke="#5d4037" strokeWidth="0.8" fill="none" />
        <path d="M42,26 Q22,16 8,16" stroke="#5d4037" strokeWidth="0.8" fill="none" />
        <path d="M40,34 Q22,26 8,28" stroke="#5d4037" strokeWidth="0.7" fill="none" />
        <path d="M38,42 Q22,36 10,40" stroke="#5d4037" strokeWidth="0.7" fill="none" />

        {/* ── BODY - torpedo dive shape ── */}
        <path d="M60,36 Q78,30 104,38 Q124,46 134,54 Q124,64 104,66 Q78,62 60,54 Z" fill="#3e2723" />
        {/* Underbelly */}
        <path d="M72,52 Q92,46 114,52 Q124,58 118,64 Q104,66 84,62 Q70,58 72,52 Z" fill="#5d4037" />
        {/* Breast streaks */}
        <path d="M76,42 L78,50" stroke="#795548" strokeWidth="0.7" opacity="0.6" />
        <path d="M82,40 L84,49" stroke="#795548" strokeWidth="0.7" opacity="0.6" />
        <path d="M88,39 L89,48" stroke="#795548" strokeWidth="0.7" opacity="0.6" />
        <path d="M94,40 L94,48" stroke="#795548" strokeWidth="0.7" opacity="0.6" />
        <path d="M100,42 L99,50" stroke="#795548" strokeWidth="0.7" opacity="0.6" />

        {/* ── TAIL - fanned ── */}
        <path d="M60,42 Q44,36 30,52 Q40,48 52,50 Q58,48 60,46 Z" fill="#3e2723" />
        <path d="M60,48 Q42,44 28,60 Q40,54 54,54 Q58,52 60,50 Z" fill="#5d4037" />
        <path d="M60,52 Q44,52 32,66 Q44,58 56,58 Q60,56 60,54 Z" fill="#3e2723" opacity="0.8" />
        {/* Tail vein lines */}
        <path d="M46,40 L34,50" stroke="#1b0f0b" strokeWidth="0.7" fill="none" />
        <path d="M44,48 L30,58" stroke="#1b0f0b" strokeWidth="0.7" fill="none" />
        <path d="M44,54 L34,64" stroke="#1b0f0b" strokeWidth="0.7" fill="none" />

        {/* ── HEAD - side profile, angry ── */}
        <g transform="translate(126, 38)">
          {/* Head shape */}
          <path d="M-2,-14 Q10,-16 20,-10 Q26,-4 24,6 Q20,14 12,16 Q4,16 0,12 Q-6,6 -6,0 Q-6,-8 -2,-14 Z" fill="#3e2723" />
          {/* Dark crown */}
          <path d="M-2,-14 Q8,-16 18,-12 Q14,-8 6,-6 Q0,-6 -3,-8 Q-4,-10 -2,-14 Z" fill="#1b0f0b" />
          {/* Lighter cheek patch */}
          <path d="M4,-2 Q10,-4 16,-2 Q18,2 16,6 Q12,8 6,6 Q2,4 4,-2 Z" fill="#5d4037" opacity="0.5" />
          {/* Malar stripe */}
          <path d="M8,6 Q6,10 4,14" stroke="#1b0f0b" strokeWidth="2.5" fill="none" strokeLinecap="round" />

          {/* === BROW - thick, angled sharply down = ANGRY === */}
          <path d="M0,-6 Q8,-12 20,-8 L18,-4 Q10,-8 2,-4 Z" fill="#1b0f0b" />
          {/* Extra brow weight */}
          <path d="M2,-5 Q10,-9 18,-6" stroke="#1b0f0b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* Furrow wrinkle above */}
          <path d="M4,-8 Q10,-11 16,-8" stroke="#1b0f0b" strokeWidth="1" fill="none" />

          {/* === EYE - narrow slit, pure rage === */}
          {/* The eye is a narrow horizontal slit - angled down at front */}
          <ellipse cx="12" cy="0" rx="6" ry="2.5" fill="#f59e0b" transform="rotate(-10, 12, 0)" />
          <ellipse cx="12" cy="0" rx="5" ry="1.8" fill="#e68a00" transform="rotate(-10, 12, 0)" />
          {/* Tight pupil */}
          <ellipse cx="14" cy="0" rx="2.5" ry="1.6" fill="#1b0f0b" transform="rotate(-10, 14, 0)" />
          {/* Glint */}
          <circle cx="15.5" cy="-0.5" r="0.8" fill="#fff" opacity="0.9" />
          {/* Upper lid - HEAVY, covers most of the eye, slammed down in anger */}
          <path d="M6,-1 Q10,-4 17,-3 Q19,-2 19,-0.5 Q15,-2 10,-2.5 Q7,-2 6,-0.5 Z" fill="#1b0f0b" />
          {/* Lower lid - pushed up tight */}
          <path d="M7,1.5 Q12,3.5 18,1.5 Q15,2.5 10,2.5 Q7,2 7,1.5 Z" fill="#3e2723" />

          {/* === BEAK - hooked, slightly open === */}
          {/* Upper mandible */}
          <path d="M22,2 Q30,2 36,6 Q38,8 36,10 L22,8 Z" fill="#d4930d" />
          {/* Hook */}
          <path d="M36,6 Q39,8 37,11 Q36,12 35,10 Z" fill="#a16f09" />
          {/* Beak ridge */}
          <path d="M24,3 Q30,3 35,6" stroke="#a16f09" strokeWidth="0.8" fill="none" />
          {/* Nostril */}
          <ellipse cx="26" cy="5" rx="1.2" ry="0.7" fill="#a16f09" />
          {/* Lower beak - open, aggressive */}
          <path d="M22,10 Q28,10 34,14 Q30,14 22,12 Z" fill="#c4830c" />
          {/* Dark mouth interior */}
          <path d="M22,8 Q28,9 35,12 Q30,12 22,10 Z" fill="#1b0f0b" opacity="0.7" />
        </g>

        {/* ── LEG + TALONS (front leg, reaching forward) ── */}
        <g transform="translate(118, 62)">
          {/* Thigh feathers */}
          <path d="M0,0 Q6,2 10,8 Q8,10 2,6 Z" fill="#5d4037" />
          {/* Leg */}
          <path d="M8,6 Q14,12 16,20" stroke="#d4930d" strokeWidth="3" fill="none" />
          {/* Scales */}
          <path d="M10,10 L13,10" stroke="#c4830c" strokeWidth="0.6" />
          <path d="M12,14 L15,14" stroke="#c4830c" strokeWidth="0.6" />
          <path d="M14,18 L17,18" stroke="#c4830c" strokeWidth="0.6" />

          {/* Short, sharp talons - dagger-like triangles */}
          {/* Front talon 1 */}
          <path d="M17,20 L24,26 L22,28 L16,22 Z" fill="#1b0f0b" />
          {/* Front talon 2 */}
          <path d="M16,22 L20,32 L17,32 L14,24 Z" fill="#1b0f0b" />
          {/* Front talon 3 */}
          <path d="M14,22 L10,30 L8,28 L12,22 Z" fill="#1b0f0b" />
          {/* Back hallux */}
          <path d="M16,20 L20,14 L22,16 L18,20 Z" fill="#1b0f0b" />
        </g>

        {/* ── LEG + TALONS (back leg) ── */}
        <g transform="translate(106, 58)">
          {/* Thigh */}
          <path d="M0,0 Q5,2 8,8 Q6,10 1,6 Z" fill="#5d4037" opacity="0.8" />
          {/* Leg */}
          <path d="M6,6 Q10,14 12,22" stroke="#d4930d" strokeWidth="2.8" fill="none" />
          {/* Scales */}
          <path d="M7,10 L10,10" stroke="#c4830c" strokeWidth="0.5" />
          <path d="M9,14 L12,14" stroke="#c4830c" strokeWidth="0.5" />
          <path d="M10,18 L13,18" stroke="#c4830c" strokeWidth="0.5" />

          {/* Short sharp talons */}
          <path d="M13,22 L19,27 L17,29 L12,24 Z" fill="#1b0f0b" />
          <path d="M12,24 L15,32 L13,32 L10,26 Z" fill="#1b0f0b" />
          <path d="M10,24 L6,30 L4,28 L8,23 Z" fill="#1b0f0b" />
          <path d="M12,22 L16,16 L18,18 L14,22 Z" fill="#1b0f0b" />
        </g>
      </g>

      {/* === BEE - to the right, about to get caught === */}
      <g transform="translate(184, 88)">
        {/* Wings */}
        <ellipse cx="5" cy="-8" rx="9" ry="5.5" fill="#fffbeb" stroke="#d4930d" strokeWidth="0.8" opacity="0.6" transform="rotate(-20, 5, -8)" />
        <ellipse cx="0" cy="-10" rx="7" ry="4.5" fill="#fffbeb" stroke="#d4930d" strokeWidth="0.8" opacity="0.6" transform="rotate(-40, 0, -10)" />
        {/* Body */}
        <ellipse cx="8" cy="2" rx="11" ry="7" fill="#f59e0b" />
        {/* Stripes */}
        <rect x="1" y="-1" width="14" height="2.2" rx="1" fill="#1b0f0b" />
        <rect x="2" y="4" width="12" height="2.2" rx="1" fill="#1b0f0b" />
        {/* Head */}
        <circle cx="20" cy="2" r="4.5" fill="#1b0f0b" />
        {/* Eye */}
        <circle cx="23" cy="0.5" r="1.3" fill="#f59e0b" />
        <circle cx="23.5" cy="0" r="0.5" fill="#1b0f0b" />
        {/* Antennae */}
        <path d="M23,-3 Q26,-8 28,-10" stroke="#1b0f0b" strokeWidth="1" fill="none" strokeLinecap="round" />
        <path d="M22,-2 Q24,-7 23,-10" stroke="#1b0f0b" strokeWidth="1" fill="none" strokeLinecap="round" />
        <circle cx="28" cy="-10.5" r="0.9" fill="#1b0f0b" />
        <circle cx="23" cy="-10.5" r="0.9" fill="#1b0f0b" />
        {/* Stinger */}
        <polygon points="-3,2 -8,0 -8,4" fill="#1b0f0b" />
        {/* Motion lines */}
        <line x1="30" y1="-1" x2="38" y2="-2" stroke="#d4930d" strokeWidth="0.8" opacity="0.35" strokeLinecap="round" />
        <line x1="30" y1="2" x2="40" y2="2" stroke="#d4930d" strokeWidth="0.8" opacity="0.35" strokeLinecap="round" />
        <line x1="30" y1="5" x2="37" y2="6" stroke="#d4930d" strokeWidth="0.8" opacity="0.35" strokeLinecap="round" />
      </g>

      {/* Honeycomb accents */}
      <g transform="translate(12, 158)" opacity="0.18">
        <polygon points="10,0 18,5 18,15 10,20 2,15 2,5" fill="none" stroke="#d4930d" strokeWidth="1.5" />
        <polygon points="26,0 34,5 34,15 26,20 18,15 18,5" fill="none" stroke="#d4930d" strokeWidth="1.5" />
        <polygon points="18,20 26,25 26,35 18,40 10,35 10,25" fill="none" stroke="#d4930d" strokeWidth="1.5" />
      </g>
      <g transform="translate(194, 158)" opacity="0.18">
        <polygon points="10,0 18,5 18,15 10,20 2,15 2,5" fill="none" stroke="#d4930d" strokeWidth="1.5" />
        <polygon points="26,0 34,5 34,15 26,20 18,15 18,5" fill="none" stroke="#d4930d" strokeWidth="1.5" />
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
