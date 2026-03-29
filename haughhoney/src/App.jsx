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
      viewBox="0 0 260 200"
      width={size}
      height={size * (200/260)}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Rounded badge background */}
      <rect x="3" y="3" width="254" height="194" rx="24" fill="#fffbeb" stroke="#d4930d" strokeWidth="3" />

      {/* === HAWK - side view, diving right toward bee === */}
      <g transform="translate(28, 30)">

        {/* ── WING (upper, swept back) ── */}
        {/* Primary flight feathers - long, separated, swept back aggressively */}
        <path d="M68,28 Q40,5 8,0" stroke="#1b0f0b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M65,34 Q35,14 2,12" stroke="#1b0f0b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M62,39 Q32,22 0,24" stroke="#1b0f0b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M60,44 Q30,30 2,36" stroke="#1b0f0b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M58,48 Q32,38 6,46" stroke="#1b0f0b" strokeWidth="2.2" fill="none" strokeLinecap="round" />

        {/* Wing fill - main shape */}
        <path d="M70,25 Q38,0 6,-2 Q0,10 -2,24 Q0,36 4,46 Q30,38 58,50 Q65,42 70,30 Z" fill="#3e2723" />

        {/* Secondary feather layer */}
        <path d="M72,35 Q50,30 25,38 Q18,44 10,50 Q30,46 55,52 Q65,46 72,38 Z" fill="#5d4037" />
        {/* Tertiary coverts */}
        <path d="M74,42 Q55,40 35,48 Q50,48 68,52 Q74,48 74,44 Z" fill="#795548" opacity="0.6" />

        {/* Feather detail strokes */}
        <path d="M50,20 Q30,10 15,8" stroke="#5d4037" strokeWidth="0.8" fill="none" />
        <path d="M48,26 Q28,18 12,18" stroke="#5d4037" strokeWidth="0.8" fill="none" />
        <path d="M46,32 Q28,26 10,28" stroke="#5d4037" strokeWidth="0.8" fill="none" />
        <path d="M44,38 Q28,34 12,38" stroke="#5d4037" strokeWidth="0.8" fill="none" />
        <path d="M55,15 Q35,5 18,3" stroke="#5d4037" strokeWidth="0.7" fill="none" />

        {/* Primary feather tip separations */}
        <path d="M8,0 L4,-4" stroke="#1b0f0b" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M2,12 L-3,9" stroke="#1b0f0b" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M0,24 L-5,22" stroke="#1b0f0b" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M2,36 L-3,35" stroke="#1b0f0b" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M6,46 L2,47" stroke="#1b0f0b" strokeWidth="1.5" strokeLinecap="round" fill="none" />

        {/* ── BODY - sleek, muscular, torpedo-shaped for dive ── */}
        <path d="M70,35 Q85,30 110,38 Q130,44 140,52 Q130,62 110,64 Q85,62 70,55 Z" fill="#3e2723" />
        {/* Underbelly - lighter */}
        <path d="M80,50 Q100,44 120,50 Q130,56 125,62 Q110,64 90,60 Q78,56 80,50 Z" fill="#5d4037" />
        {/* Chest streaking */}
        <path d="M82,42 L84,50" stroke="#795548" strokeWidth="0.7" opacity="0.6" />
        <path d="M88,40 L90,49" stroke="#795548" strokeWidth="0.7" opacity="0.6" />
        <path d="M94,39 L95,48" stroke="#795548" strokeWidth="0.7" opacity="0.6" />
        <path d="M100,40 L100,49" stroke="#795548" strokeWidth="0.7" opacity="0.6" />
        <path d="M106,42 L105,50" stroke="#795548" strokeWidth="0.7" opacity="0.6" />
        <path d="M86,52 L87,58" stroke="#795548" strokeWidth="0.5" opacity="0.4" />
        <path d="M92,51 L93,58" stroke="#795548" strokeWidth="0.5" opacity="0.4" />
        <path d="M98,51 L98,58" stroke="#795548" strokeWidth="0.5" opacity="0.4" />

        {/* ── TAIL FEATHERS - fanned behind ── */}
        <path d="M70,42 Q50,35 35,52 Q42,50 52,50 Q62,48 70,46 Z" fill="#3e2723" />
        <path d="M70,46 Q48,42 32,58 Q42,54 55,54 Q64,52 70,50 Z" fill="#5d4037" />
        <path d="M70,50 Q50,50 35,64 Q45,58 58,58 Q66,56 70,54 Z" fill="#3e2723" opacity="0.85" />
        <path d="M70,54 Q52,56 40,70 Q50,62 60,60 Q68,58 70,56 Z" fill="#5d4037" opacity="0.7" />
        {/* Tail feather detail lines */}
        <path d="M50,40 L38,50" stroke="#1b0f0b" strokeWidth="0.8" fill="none" />
        <path d="M48,46 L34,56" stroke="#1b0f0b" strokeWidth="0.8" fill="none" />
        <path d="M48,52 L36,62" stroke="#1b0f0b" strokeWidth="0.8" fill="none" />
        <path d="M50,56 L42,68" stroke="#1b0f0b" strokeWidth="0.8" fill="none" />

        {/* ── HEAD - side profile, turned slightly, FURIOUS expression ── */}
        <g transform="translate(132, 38)">
          {/* Head shape - angular, predatory profile */}
          <path d="M0,-10 Q12,-14 20,-8 Q24,-2 22,6 Q18,12 10,14 Q4,14 0,10 Q-4,6 -4,0 Q-4,-6 0,-10 Z" fill="#3e2723" />
          {/* Crown - dark cap */}
          <path d="M0,-10 Q10,-14 18,-10 Q14,-6 6,-4 Q0,-4 -2,-6 Q-3,-8 0,-10 Z" fill="#1b0f0b" />

          {/* === BROW - heavy, angry, slanting sharply down toward beak === */}
          {/* This is the key intimidation feature - a thick angry brow shelf */}
          <path d="M-2,-4 Q4,-8 14,-6 Q18,-4 20,-2 L18,0 Q14,-3 8,-4 Q2,-4 0,-2 Z" fill="#1b0f0b" />
          {/* Secondary brow crease - adds fury wrinkle */}
          <path d="M2,-2 Q8,-5 16,-3" stroke="#1b0f0b" strokeWidth="1.5" fill="none" />

          {/* === EYE - narrow, squinting, ENRAGED === */}
          {/* Eye is slanted and narrowed like a furious glare */}
          <ellipse cx="10" cy="1" rx="5" ry="3" fill="#f59e0b" transform="rotate(-8, 10, 1)" />
          <ellipse cx="10" cy="1" rx="4" ry="2.2" fill="#e68a00" transform="rotate(-8, 10, 1)" />
          {/* Pupil - dilated, locked on target */}
          <ellipse cx="12" cy="1" rx="2.2" ry="2" fill="#1b0f0b" transform="rotate(-8, 12, 1)" />
          {/* Glint */}
          <circle cx="13" cy="-0.5" r="0.8" fill="#fff" opacity="0.9" />
          {/* Heavy upper eyelid - squinting with rage, covering top of eye */}
          <path d="M5,0 Q8,-3 14,-2.5 Q17,-1.5 18,0 Q14,-1 10,-1.5 Q7,-1 5,0 Z" fill="#1b0f0b" />
          {/* Lower eyelid pushed up - squinting */}
          <path d="M6,2.5 Q10,4 15,2.5 Q12,3.5 8,3.5 Z" fill="#3e2723" />
          {/* Wrinkle lines around eye - fury marks */}
          <path d="M5,-1 Q3,-2 1,-2" stroke="#1b0f0b" strokeWidth="0.8" fill="none" />
          <path d="M5,0 Q3,0 1,1" stroke="#1b0f0b" strokeWidth="0.6" fill="none" />

          {/* === BEAK - large, hooked, open slightly showing aggression === */}
          {/* Upper beak */}
          <path d="M20,2 Q28,2 34,6 Q36,8 34,10 Q30,8 24,8 Q20,8 18,8 Z" fill="#d4930d" />
          {/* Beak hook - sharp curved tip */}
          <path d="M34,6 Q37,7 36,10 Q35,12 33,11 Q34,9 34,8 Z" fill="#a16f09" />
          {/* Upper beak ridge detail */}
          <path d="M22,3 Q28,3 33,6" stroke="#a16f09" strokeWidth="0.7" fill="none" />
          {/* Nostril */}
          <ellipse cx="24" cy="5" rx="1" ry="0.7" fill="#a16f09" />

          {/* Lower beak - slightly open, screaming */}
          <path d="M18,10 Q24,10 30,12 Q32,13 30,14 Q24,12 18,12 Z" fill="#c4830c" />
          {/* Open mouth gap - dark interior showing rage */}
          <path d="M20,8 Q26,9 32,11 Q30,12 24,10 Q20,10 20,8 Z" fill="#1b0f0b" opacity="0.7" />
          {/* Mouth corner crease */}
          <path d="M18,8 Q19,10 18,12" stroke="#a16f09" strokeWidth="0.6" fill="none" />
        </g>

        {/* ── LEGS & TALONS - extended forward, reaching for the kill ── */}

        {/* == UPPER LEG (closer, larger) == */}
        <g transform="translate(120, 62)">
          {/* Thigh feathers */}
          <path d="M0,0 Q8,2 12,8 Q10,10 4,8 Q0,4 0,0 Z" fill="#5d4037" />
          {/* Scaled leg */}
          <path d="M10,6 Q18,16 22,28" stroke="#d4930d" strokeWidth="3.5" fill="none" />
          {/* Scale marks */}
          <path d="M12,10 L16,10" stroke="#c4830c" strokeWidth="0.7" />
          <path d="M14,14 L18,14" stroke="#c4830c" strokeWidth="0.7" />
          <path d="M16,18 L20,18" stroke="#c4830c" strokeWidth="0.7" />
          <path d="M18,22 L22,22" stroke="#c4830c" strokeWidth="0.7" />
          <path d="M19,26 L23,26" stroke="#c4830c" strokeWidth="0.7" />

          {/* Foot pad */}
          <ellipse cx="23" cy="30" rx="4" ry="2.5" fill="#d4930d" />

          {/* TALON 1 - front, longest, killer claw curving down */}
          <path d="M24,28 Q32,30 38,36 Q42,42 40,48" stroke="#1b0f0b" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M40,48 Q39,52 37,50" stroke="#1b0f0b" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* TALON 2 - front middle */}
          <path d="M25,30 Q34,36 38,44 Q40,50 38,54" stroke="#1b0f0b" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M38,54 Q37,57 35,55" stroke="#1b0f0b" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* TALON 3 - front outer, splayed wide */}
          <path d="M22,32 Q28,40 30,48 Q32,54 30,60" stroke="#1b0f0b" strokeWidth="2.8" fill="none" strokeLinecap="round" />
          <path d="M30,60 Q29,63 27,61" stroke="#1b0f0b" strokeWidth="1.8" fill="none" strokeLinecap="round" />

          {/* TALON 4 - back hallux, opposing grip */}
          <path d="M22,28 Q16,24 12,18 Q10,14 8,10" stroke="#1b0f0b" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M8,10 Q7,7 9,8" stroke="#1b0f0b" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>

        {/* == LOWER LEG (farther, slightly smaller) == */}
        <g transform="translate(108, 58)">
          {/* Thigh feathers */}
          <path d="M0,0 Q6,2 10,8 Q8,10 2,6 Q0,3 0,0 Z" fill="#5d4037" opacity="0.8" />
          {/* Scaled leg */}
          <path d="M8,6 Q14,18 18,30" stroke="#d4930d" strokeWidth="3" fill="none" />
          {/* Scale marks */}
          <path d="M9,10 L13,10" stroke="#c4830c" strokeWidth="0.6" />
          <path d="M11,14 L15,14" stroke="#c4830c" strokeWidth="0.6" />
          <path d="M13,18 L17,18" stroke="#c4830c" strokeWidth="0.6" />
          <path d="M14,22 L18,22" stroke="#c4830c" strokeWidth="0.6" />
          <path d="M16,26 L20,26" stroke="#c4830c" strokeWidth="0.6" />

          {/* Foot pad */}
          <ellipse cx="19" cy="32" rx="3.5" ry="2" fill="#d4930d" />

          {/* TALON 1 - front */}
          <path d="M20,30 Q26,34 30,40 Q34,46 32,52" stroke="#1b0f0b" strokeWidth="2.8" fill="none" strokeLinecap="round" />
          <path d="M32,52 Q31,55 29,53" stroke="#1b0f0b" strokeWidth="1.8" fill="none" strokeLinecap="round" />

          {/* TALON 2 - front middle */}
          <path d="M20,32 Q28,38 32,46 Q34,52 32,56" stroke="#1b0f0b" strokeWidth="2.8" fill="none" strokeLinecap="round" />
          <path d="M32,56 Q31,59 29,57" stroke="#1b0f0b" strokeWidth="1.8" fill="none" strokeLinecap="round" />

          {/* TALON 3 - outer */}
          <path d="M18,34 Q22,40 24,48 Q26,54 24,60" stroke="#1b0f0b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M24,60 Q23,63 21,61" stroke="#1b0f0b" strokeWidth="1.5" fill="none" strokeLinecap="round" />

          {/* TALON 4 - back hallux */}
          <path d="M18,30 Q12,26 8,20 Q6,16 4,12" stroke="#1b0f0b" strokeWidth="2.8" fill="none" strokeLinecap="round" />
          <path d="M4,12 Q3,9 5,10" stroke="#1b0f0b" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </g>
      </g>

      {/* === BEE - ahead of the hawk, about to get caught === */}
      <g transform="translate(195, 100)">
        {/* Wings - frantic buzzing */}
        <ellipse cx="5" cy="-8" rx="10" ry="6" fill="#fffbeb" stroke="#d4930d" strokeWidth="0.8" opacity="0.6" transform="rotate(-20, 5, -8)" />
        <ellipse cx="0" cy="-10" rx="8" ry="5" fill="#fffbeb" stroke="#d4930d" strokeWidth="0.8" opacity="0.6" transform="rotate(-40, 0, -10)" />
        {/* Body */}
        <ellipse cx="8" cy="2" rx="12" ry="8" fill="#f59e0b" />
        {/* Stripes */}
        <rect x="1" y="-1" width="14" height="2.5" rx="1.2" fill="#1b0f0b" />
        <rect x="2" y="4" width="12" height="2.5" rx="1.2" fill="#1b0f0b" />
        {/* Head */}
        <circle cx="21" cy="2" r="5" fill="#1b0f0b" />
        {/* Eye - panicked */}
        <circle cx="24" cy="0.5" r="1.5" fill="#f59e0b" />
        <circle cx="24.5" cy="0" r="0.6" fill="#1b0f0b" />
        {/* Antennae - swept back in flight */}
        <path d="M24,-4 Q28,-9 30,-11" stroke="#1b0f0b" strokeWidth="1" fill="none" strokeLinecap="round" />
        <path d="M23,-3 Q26,-8 25,-12" stroke="#1b0f0b" strokeWidth="1" fill="none" strokeLinecap="round" />
        <circle cx="30" cy="-11.5" r="1" fill="#1b0f0b" />
        <circle cx="25" cy="-12.5" r="1" fill="#1b0f0b" />
        {/* Stinger */}
        <polygon points="-4,2 -9,0 -9,4" fill="#1b0f0b" />
        {/* Legs dangling in panic */}
        <path d="M5,9 Q4,14 6,16" stroke="#1b0f0b" strokeWidth="0.7" fill="none" />
        <path d="M8,10 Q7,15 9,17" stroke="#1b0f0b" strokeWidth="0.7" fill="none" />
        <path d="M12,10 Q12,14 14,16" stroke="#1b0f0b" strokeWidth="0.7" fill="none" />
        {/* Motion lines - desperate escape */}
        <line x1="32" y1="-2" x2="40" y2="-3" stroke="#d4930d" strokeWidth="1" opacity="0.4" strokeLinecap="round" />
        <line x1="32" y1="2" x2="42" y2="2" stroke="#d4930d" strokeWidth="1" opacity="0.4" strokeLinecap="round" />
        <line x1="32" y1="6" x2="39" y2="7" stroke="#d4930d" strokeWidth="1" opacity="0.4" strokeLinecap="round" />
      </g>

      {/* Honeycomb accents - bottom corners */}
      <g transform="translate(12, 160)" opacity="0.18">
        <polygon points="10,0 18,5 18,15 10,20 2,15 2,5" fill="none" stroke="#d4930d" strokeWidth="1.5" />
        <polygon points="26,0 34,5 34,15 26,20 18,15 18,5" fill="none" stroke="#d4930d" strokeWidth="1.5" />
        <polygon points="18,20 26,25 26,35 18,40 10,35 10,25" fill="none" stroke="#d4930d" strokeWidth="1.5" />
      </g>
      <g transform="translate(200, 160)" opacity="0.18">
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
