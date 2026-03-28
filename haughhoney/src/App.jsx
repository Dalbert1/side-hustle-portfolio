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
      viewBox="0 0 240 240"
      width={size}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Circle badge */}
      <circle cx="120" cy="120" r="116" fill="#fffbeb" stroke="#d4930d" strokeWidth="3" />

      {/* === HAWK - tattoo style, full wingspan === */}
      <g transform="translate(120, 105) scale(0.88)">

        {/* ── LEFT WING (hawk's right) ── */}
        <g>
          {/* Primary flight feathers - long, separated tips */}
          <path d="M-10,-15 Q-45,-65 -95,-85" stroke="#1b0f0b" strokeWidth="2.2" fill="none" />
          <path d="M-10,-12 Q-50,-55 -100,-70" stroke="#1b0f0b" strokeWidth="2.2" fill="none" />
          <path d="M-10,-9 Q-55,-45 -105,-55" stroke="#1b0f0b" strokeWidth="2.2" fill="none" />
          <path d="M-10,-6 Q-55,-35 -105,-40" stroke="#1b0f0b" strokeWidth="2.2" fill="none" />
          <path d="M-10,-3 Q-55,-25 -100,-27" stroke="#1b0f0b" strokeWidth="2.2" fill="none" />

          {/* Wing fill shape */}
          <path d="M-5,-18 Q-40,-70 -95,-88 Q-100,-72 -105,-58 Q-108,-42 -103,-28 Q-60,-15 -10,2 Z" fill="#3e2723" />

          {/* Secondary feathers - layered rows */}
          <path d="M-8,0 Q-45,-15 -85,-18 Q-80,-12 -8,5 Z" fill="#5d4037" />
          <path d="M-6,4 Q-40,-5 -70,-6 Q-65,0 -6,10 Z" fill="#3e2723" />

          {/* Feather detail strokes - inner wing */}
          <path d="M-20,-10 Q-35,-30 -55,-42" stroke="#5d4037" strokeWidth="0.8" fill="none" />
          <path d="M-18,-5 Q-32,-22 -50,-32" stroke="#5d4037" strokeWidth="0.8" fill="none" />
          <path d="M-16,0 Q-30,-14 -48,-22" stroke="#5d4037" strokeWidth="0.8" fill="none" />
          <path d="M-25,-20 Q-45,-45 -70,-58" stroke="#5d4037" strokeWidth="0.7" fill="none" />
          <path d="M-22,-15 Q-40,-35 -62,-48" stroke="#5d4037" strokeWidth="0.7" fill="none" />

          {/* Covert feather rows */}
          <path d="M-12,6 Q-30,0 -55,-2 Q-50,4 -12,12 Z" fill="#795548" opacity="0.5" />

          {/* Primary feather separations at tips */}
          <line x1="-88" y1="-82" x2="-95" y2="-88" stroke="#1b0f0b" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="-94" y1="-66" x2="-102" y2="-72" stroke="#1b0f0b" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="-99" y1="-51" x2="-107" y2="-56" stroke="#1b0f0b" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="-100" y1="-36" x2="-108" y2="-40" stroke="#1b0f0b" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="-96" y1="-24" x2="-103" y2="-27" stroke="#1b0f0b" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* ── RIGHT WING (hawk's left) ── */}
        <g>
          {/* Primary flight feathers */}
          <path d="M10,-15 Q45,-65 95,-85" stroke="#1b0f0b" strokeWidth="2.2" fill="none" />
          <path d="M10,-12 Q50,-55 100,-70" stroke="#1b0f0b" strokeWidth="2.2" fill="none" />
          <path d="M10,-9 Q55,-45 105,-55" stroke="#1b0f0b" strokeWidth="2.2" fill="none" />
          <path d="M10,-6 Q55,-35 105,-40" stroke="#1b0f0b" strokeWidth="2.2" fill="none" />
          <path d="M10,-3 Q55,-25 100,-27" stroke="#1b0f0b" strokeWidth="2.2" fill="none" />

          {/* Wing fill shape */}
          <path d="M5,-18 Q40,-70 95,-88 Q100,-72 105,-58 Q108,-42 103,-28 Q60,-15 10,2 Z" fill="#3e2723" />

          {/* Secondary feathers */}
          <path d="M8,0 Q45,-15 85,-18 Q80,-12 8,5 Z" fill="#5d4037" />
          <path d="M6,4 Q40,-5 70,-6 Q65,0 6,10 Z" fill="#3e2723" />

          {/* Feather detail strokes */}
          <path d="M20,-10 Q35,-30 55,-42" stroke="#5d4037" strokeWidth="0.8" fill="none" />
          <path d="M18,-5 Q32,-22 50,-32" stroke="#5d4037" strokeWidth="0.8" fill="none" />
          <path d="M16,0 Q30,-14 48,-22" stroke="#5d4037" strokeWidth="0.8" fill="none" />
          <path d="M25,-20 Q45,-45 70,-58" stroke="#5d4037" strokeWidth="0.7" fill="none" />
          <path d="M22,-15 Q40,-35 62,-48" stroke="#5d4037" strokeWidth="0.7" fill="none" />

          {/* Covert feather rows */}
          <path d="M12,6 Q30,0 55,-2 Q50,4 12,12 Z" fill="#795548" opacity="0.5" />

          {/* Primary feather tip separations */}
          <line x1="88" y1="-82" x2="95" y2="-88" stroke="#1b0f0b" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="94" y1="-66" x2="102" y2="-72" stroke="#1b0f0b" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="99" y1="-51" x2="107" y2="-56" stroke="#1b0f0b" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="100" y1="-36" x2="108" y2="-40" stroke="#1b0f0b" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="96" y1="-24" x2="103" y2="-27" stroke="#1b0f0b" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* ── BODY ── */}
        <ellipse cx="0" cy="8" rx="16" ry="22" fill="#3e2723" />
        {/* Chest feather texture */}
        <path d="M-8,0 Q0,-4 8,0 Q4,6 0,8 Q-4,6 -8,0 Z" fill="#5d4037" />
        <path d="M-6,8 Q0,5 6,8 Q3,14 0,16 Q-3,14 -6,8 Z" fill="#5d4037" />
        <path d="M-10,2 L-8,8" stroke="#795548" strokeWidth="0.6" opacity="0.6" />
        <path d="M-6,-2 L-4,5" stroke="#795548" strokeWidth="0.6" opacity="0.6" />
        <path d="M6,-2 L4,5" stroke="#795548" strokeWidth="0.6" opacity="0.6" />
        <path d="M10,2 L8,8" stroke="#795548" strokeWidth="0.6" opacity="0.6" />
        <path d="M-3,10 L-2,18" stroke="#795548" strokeWidth="0.5" opacity="0.5" />
        <path d="M3,10 L2,18" stroke="#795548" strokeWidth="0.5" opacity="0.5" />

        {/* ── HEAD ── */}
        <g transform="translate(0, -22)">
          {/* Head shape */}
          <path d="M0,-12 Q10,-12 13,-4 Q14,4 10,8 L-10,8 Q-14,4 -13,-4 Q-10,-12 0,-12 Z" fill="#3e2723" />
          {/* Crown/top of head - darker */}
          <path d="M0,-12 Q8,-12 11,-6 Q0,-8 -11,-6 Q-8,-12 0,-12 Z" fill="#1b0f0b" />
          {/* Brow ridge - fierce V shape */}
          <path d="M-12,-2 Q-6,-6 0,-4 Q6,-6 12,-2 L10,0 Q6,-3 0,-1 Q-6,-3 -10,0 Z" fill="#1b0f0b" />

          {/* Eyes - intense, angry */}
          <ellipse cx="-6" cy="1" rx="3.5" ry="3" fill="#f59e0b" />
          <ellipse cx="-6" cy="1" rx="2.5" ry="2.2" fill="#e68a00" />
          <circle cx="-5.5" cy="0.5" r="1.5" fill="#1b0f0b" />
          <circle cx="-5" cy="0" r="0.5" fill="#fff" opacity="0.8" />

          <ellipse cx="6" cy="1" rx="3.5" ry="3" fill="#f59e0b" />
          <ellipse cx="6" cy="1" rx="2.5" ry="2.2" fill="#e68a00" />
          <circle cx="6.5" cy="0.5" r="1.5" fill="#1b0f0b" />
          <circle cx="7" cy="0" r="0.5" fill="#fff" opacity="0.8" />

          {/* Beak - sharp hooked raptor beak */}
          <path d="M-4,6 L0,18 L4,6 Z" fill="#d4930d" />
          <path d="M0,18 Q1,19 0,20" fill="#a16f09" />
          {/* Beak detail line */}
          <line x1="0" y1="8" x2="0" y2="17" stroke="#a16f09" strokeWidth="0.8" />
          {/* Nostrils */}
          <circle cx="-2" cy="8" r="0.6" fill="#a16f09" />
          <circle cx="2" cy="8" r="0.6" fill="#a16f09" />
          {/* Beak hook */}
          <path d="M-1,17 L0,20 L1,17" fill="#a16f09" />
        </g>

        {/* ── TAIL FEATHERS - fanned wide ── */}
        <g transform="translate(0, 28)">
          <path d="M0,0 Q-5,15 -18,35 Q-12,32 -8,25 Q-5,15 0,5 Z" fill="#3e2723" />
          <path d="M0,0 Q-2,18 -8,38 Q-4,34 -2,26 Q0,16 0,5 Z" fill="#5d4037" />
          <path d="M0,0 Q2,18 8,38 Q4,34 2,26 Q0,16 0,5 Z" fill="#5d4037" />
          <path d="M0,0 Q5,15 18,35 Q12,32 8,25 Q5,15 0,5 Z" fill="#3e2723" />
          {/* Center tail feather */}
          <path d="M-2,2 Q0,20 0,40 Q0,20 2,2 Z" fill="#1b0f0b" opacity="0.4" />
          {/* Tail feather edge details */}
          <path d="M-14,30 L-18,35" stroke="#1b0f0b" strokeWidth="1" strokeLinecap="round" />
          <path d="M-6,34 L-8,38" stroke="#1b0f0b" strokeWidth="1" strokeLinecap="round" />
          <path d="M6,34 L8,38" stroke="#1b0f0b" strokeWidth="1" strokeLinecap="round" />
          <path d="M14,30 L18,35" stroke="#1b0f0b" strokeWidth="1" strokeLinecap="round" />
        </g>

        {/* ── LEFT LEG & TALONS ── */}
        <g transform="translate(-14, 22)">
          {/* Leg - muscular, scaled */}
          <path d="M0,0 Q-4,10 -6,20" stroke="#d4930d" strokeWidth="3" fill="none" />
          <path d="M-1,5 L1,5" stroke="#c4830c" strokeWidth="0.5" />
          <path d="M-2,9 L0,9" stroke="#c4830c" strokeWidth="0.5" />
          <path d="M-3,13 L-1,13" stroke="#c4830c" strokeWidth="0.5" />
          <path d="M-4,17 L-2,17" stroke="#c4830c" strokeWidth="0.5" />

          {/* Foot structure */}
          <circle cx="-6" cy="22" r="2.5" fill="#d4930d" />

          {/* Front talon 1 - long, curved, razor sharp */}
          <path d="M-5,22 Q-2,28 0,32 Q2,36 0,40" stroke="#1b0f0b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M0,40 Q-1,42 -2,41" fill="#1b0f0b" />

          {/* Front talon 2 */}
          <path d="M-7,23 Q-10,30 -12,34 Q-13,38 -14,40" stroke="#1b0f0b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M-14,40 Q-15,42 -16,41" fill="#1b0f0b" />

          {/* Front talon 3 - outer */}
          <path d="M-8,22 Q-14,26 -18,30 Q-22,34 -24,36" stroke="#1b0f0b" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M-24,36 Q-25,38 -26,37" fill="#1b0f0b" />

          {/* Back talon - opposing, deadly */}
          <path d="M-4,21 Q0,18 4,14 Q6,12 8,10" stroke="#1b0f0b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M8,10 Q9,8 8,8" fill="#1b0f0b" />

          {/* Talon tips - sharp points */}
          <circle cx="0" cy="41" r="0.8" fill="#1b0f0b" />
          <circle cx="-14" cy="41" r="0.8" fill="#1b0f0b" />
          <circle cx="-25" cy="37" r="0.7" fill="#1b0f0b" />
          <circle cx="8" cy="9" r="0.7" fill="#1b0f0b" />
        </g>

        {/* ── RIGHT LEG & TALONS ── */}
        <g transform="translate(14, 22)">
          {/* Leg */}
          <path d="M0,0 Q4,10 6,20" stroke="#d4930d" strokeWidth="3" fill="none" />
          <path d="M1,5 L-1,5" stroke="#c4830c" strokeWidth="0.5" />
          <path d="M2,9 L0,9" stroke="#c4830c" strokeWidth="0.5" />
          <path d="M3,13 L1,13" stroke="#c4830c" strokeWidth="0.5" />
          <path d="M4,17 L2,17" stroke="#c4830c" strokeWidth="0.5" />

          {/* Foot structure */}
          <circle cx="6" cy="22" r="2.5" fill="#d4930d" />

          {/* Front talon 1 */}
          <path d="M5,22 Q2,28 0,32 Q-2,36 0,40" stroke="#1b0f0b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M0,40 Q1,42 2,41" fill="#1b0f0b" />

          {/* Front talon 2 */}
          <path d="M7,23 Q10,30 12,34 Q13,38 14,40" stroke="#1b0f0b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M14,40 Q15,42 16,41" fill="#1b0f0b" />

          {/* Front talon 3 - outer */}
          <path d="M8,22 Q14,26 18,30 Q22,34 24,36" stroke="#1b0f0b" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M24,36 Q25,38 26,37" fill="#1b0f0b" />

          {/* Back talon */}
          <path d="M4,21 Q0,18 -4,14 Q-6,12 -8,10" stroke="#1b0f0b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M-8,10 Q-9,8 -8,8" fill="#1b0f0b" />

          {/* Talon tips */}
          <circle cx="0" cy="41" r="0.8" fill="#1b0f0b" />
          <circle cx="14" cy="41" r="0.8" fill="#1b0f0b" />
          <circle cx="25" cy="37" r="0.7" fill="#1b0f0b" />
          <circle cx="-8" cy="9" r="0.7" fill="#1b0f0b" />
        </g>
      </g>

      {/* === BEE - small, fleeing below the hawk === */}
      <g transform="translate(155, 175) scale(0.7)">
        {/* Wings */}
        <ellipse cx="18" cy="4" rx="9" ry="5" fill="#fffbeb" stroke="#d4930d" strokeWidth="0.8" opacity="0.6" transform="rotate(-30, 18, 4)" />
        <ellipse cx="14" cy="2" rx="7" ry="4.5" fill="#fffbeb" stroke="#d4930d" strokeWidth="0.8" opacity="0.6" transform="rotate(-45, 14, 2)" />
        {/* Body */}
        <ellipse cx="20" cy="15" rx="11" ry="7" fill="#f59e0b" />
        {/* Stripes */}
        <rect x="13" y="12" width="14" height="2.2" rx="1" fill="#1b0f0b" />
        <rect x="14" y="17" width="12" height="2.2" rx="1" fill="#1b0f0b" />
        {/* Head */}
        <circle cx="32" cy="15" r="4.5" fill="#1b0f0b" />
        {/* Eye */}
        <circle cx="34.5" cy="13.5" r="1.1" fill="#f59e0b" />
        {/* Antennae */}
        <path d="M35,10 Q38,5 40,3" stroke="#1b0f0b" strokeWidth="1" fill="none" strokeLinecap="round" />
        <path d="M34,11 Q36,6 35,2" stroke="#1b0f0b" strokeWidth="1" fill="none" strokeLinecap="round" />
        <circle cx="40" cy="2.5" r="1" fill="#1b0f0b" />
        <circle cx="35" cy="1.5" r="1" fill="#1b0f0b" />
        {/* Stinger */}
        <polygon points="9,15 3,13 3,17" fill="#1b0f0b" />
        {/* Motion lines */}
        <line x1="-2" y1="11" x2="-10" y2="10" stroke="#d4930d" strokeWidth="0.8" opacity="0.35" strokeLinecap="round" />
        <line x1="-1" y1="15" x2="-9" y2="15" stroke="#d4930d" strokeWidth="0.8" opacity="0.35" strokeLinecap="round" />
        <line x1="-2" y1="19" x2="-8" y2="20" stroke="#d4930d" strokeWidth="0.8" opacity="0.35" strokeLinecap="round" />
      </g>

      {/* Honeycomb accent - bottom left */}
      <g transform="translate(18, 185)" opacity="0.2">
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
