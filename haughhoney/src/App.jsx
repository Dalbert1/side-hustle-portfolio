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

      {/* === HAWK - front-facing, wings spread, realistic & angry === */}
      <g transform="translate(120, 108) scale(0.9)">

        {/* ── LEFT WING ── */}
        <g>
          {/* Wing base shape */}
          <path d="M-8,-10 Q-50,-60 -100,-82 Q-104,-68 -108,-52 Q-110,-36 -106,-22 Q-65,-10 -8,6 Z" fill="#3e2723" />
          {/* Primary feathers - individual fingers */}
          <path d="M-85,-78 Q-92,-84 -98,-92" stroke="#1b0f0b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M-92,-68 Q-100,-72 -108,-78" stroke="#1b0f0b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M-97,-56 Q-104,-58 -112,-62" stroke="#1b0f0b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M-100,-42 Q-106,-42 -114,-44" stroke="#1b0f0b" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M-100,-28 Q-106,-26 -112,-28" stroke="#1b0f0b" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          {/* Secondary feather layer */}
          <path d="M-10,2 Q-48,-8 -88,-12 Q-82,-4 -10,10 Z" fill="#5d4037" />
          <path d="M-8,8 Q-42,0 -72,-2 Q-66,6 -8,16 Z" fill="#3e2723" opacity="0.8" />
          {/* Covert row */}
          <path d="M-8,14 Q-35,8 -58,6 Q-52,14 -8,20 Z" fill="#795548" opacity="0.5" />
          {/* Feather vein lines */}
          <path d="M-30,-20 Q-55,-45 -78,-62" stroke="#5d4037" strokeWidth="0.8" fill="none" />
          <path d="M-28,-12 Q-50,-32 -70,-48" stroke="#5d4037" strokeWidth="0.8" fill="none" />
          <path d="M-25,-4 Q-46,-20 -64,-32" stroke="#5d4037" strokeWidth="0.8" fill="none" />
          <path d="M-22,4 Q-42,-8 -58,-18" stroke="#5d4037" strokeWidth="0.7" fill="none" />
          <path d="M-20,10 Q-38,0 -52,-6" stroke="#5d4037" strokeWidth="0.7" fill="none" />
          <path d="M-35,-30 Q-60,-55 -88,-72" stroke="#5d4037" strokeWidth="0.6" fill="none" />
        </g>

        {/* ── RIGHT WING ── */}
        <g>
          {/* Wing base shape */}
          <path d="M8,-10 Q50,-60 100,-82 Q104,-68 108,-52 Q110,-36 106,-22 Q65,-10 8,6 Z" fill="#3e2723" />
          {/* Primary feathers */}
          <path d="M85,-78 Q92,-84 98,-92" stroke="#1b0f0b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M92,-68 Q100,-72 108,-78" stroke="#1b0f0b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M97,-56 Q104,-58 112,-62" stroke="#1b0f0b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M100,-42 Q106,-42 114,-44" stroke="#1b0f0b" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M100,-28 Q106,-26 112,-28" stroke="#1b0f0b" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          {/* Secondary feather layer */}
          <path d="M10,2 Q48,-8 88,-12 Q82,-4 10,10 Z" fill="#5d4037" />
          <path d="M8,8 Q42,0 72,-2 Q66,6 8,16 Z" fill="#3e2723" opacity="0.8" />
          {/* Covert row */}
          <path d="M8,14 Q35,8 58,6 Q52,14 8,20 Z" fill="#795548" opacity="0.5" />
          {/* Feather vein lines */}
          <path d="M30,-20 Q55,-45 78,-62" stroke="#5d4037" strokeWidth="0.8" fill="none" />
          <path d="M28,-12 Q50,-32 70,-48" stroke="#5d4037" strokeWidth="0.8" fill="none" />
          <path d="M25,-4 Q46,-20 64,-32" stroke="#5d4037" strokeWidth="0.8" fill="none" />
          <path d="M22,4 Q42,-8 58,-18" stroke="#5d4037" strokeWidth="0.7" fill="none" />
          <path d="M20,10 Q38,0 52,-6" stroke="#5d4037" strokeWidth="0.7" fill="none" />
          <path d="M35,-30 Q60,-55 88,-72" stroke="#5d4037" strokeWidth="0.6" fill="none" />
        </g>

        {/* ── BODY ── */}
        <ellipse cx="0" cy="10" rx="18" ry="24" fill="#3e2723" />
        {/* Chest - lighter breast feathers with realistic V-marks */}
        <path d="M-10,2 Q0,-2 10,2 Q6,10 0,14 Q-6,10 -10,2 Z" fill="#5d4037" />
        <path d="M-8,12 Q0,9 8,12 Q4,20 0,22 Q-4,20 -8,12 Z" fill="#5d4037" />
        {/* Breast streaking - realistic hawk chest pattern */}
        <path d="M-5,4 L-3,3 L-1,5" stroke="#795548" strokeWidth="0.8" fill="none" />
        <path d="M1,3 L3,2 L5,4" stroke="#795548" strokeWidth="0.8" fill="none" />
        <path d="M-4,8 L-2,7 L0,9" stroke="#795548" strokeWidth="0.8" fill="none" />
        <path d="M0,7 L2,6 L4,8" stroke="#795548" strokeWidth="0.8" fill="none" />
        <path d="M-6,14 L-4,13 L-2,15" stroke="#795548" strokeWidth="0.7" fill="none" />
        <path d="M0,13 L2,12 L4,14" stroke="#795548" strokeWidth="0.7" fill="none" />
        <path d="M-3,18 L-1,17 L1,19" stroke="#795548" strokeWidth="0.6" fill="none" />
        <path d="M-7,5 L-9,8" stroke="#795548" strokeWidth="0.5" opacity="0.5" />
        <path d="M7,5 L9,8" stroke="#795548" strokeWidth="0.5" opacity="0.5" />

        {/* ── HEAD ── */}
        <g transform="translate(0, -24)">
          {/* Head shape - broad, powerful */}
          <path d="M0,-14 Q12,-14 16,-6 Q17,2 14,8 Q8,12 0,12 Q-8,12 -14,8 Q-17,2 -16,-6 Q-12,-14 0,-14 Z" fill="#3e2723" />
          {/* Crown - dark cap like a real hawk */}
          <path d="M0,-14 Q10,-14 14,-8 Q6,-10 0,-10 Q-6,-10 -14,-8 Q-10,-14 0,-14 Z" fill="#1b0f0b" />
          {/* Facial disc - lighter cheek area like a real raptor */}
          <path d="M-14,-2 Q-10,-6 -4,-4 Q-2,0 -4,4 Q-8,6 -12,4 Q-16,2 -14,-2 Z" fill="#5d4037" opacity="0.6" />
          <path d="M14,-2 Q10,-6 4,-4 Q2,0 4,4 Q8,6 12,4 Q16,2 14,-2 Z" fill="#5d4037" opacity="0.6" />
          {/* Dark malar stripe - the "sideburn" marking hawks have */}
          <path d="M-6,4 Q-8,8 -10,12" stroke="#1b0f0b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M6,4 Q8,8 10,12" stroke="#1b0f0b" strokeWidth="2.5" fill="none" strokeLinecap="round" />

          {/* === BROW RIDGE - massive, angry, overhanging === */}
          <path d="M-16,-4 Q-8,-10 0,-6 Q8,-10 16,-4 L14,-1 Q8,-6 0,-3 Q-8,-6 -14,-1 Z" fill="#1b0f0b" />
          {/* Extra brow thickness - really angry furrowed brow */}
          <path d="M-14,-3 Q-8,-7 -2,-4" stroke="#1b0f0b" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M14,-3 Q8,-7 2,-4" stroke="#1b0f0b" strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* Brow wrinkles - fury lines */}
          <path d="M-4,-6 Q0,-8 4,-6" stroke="#1b0f0b" strokeWidth="1" fill="none" />
          <path d="M-3,-8 Q0,-9 3,-8" stroke="#1b0f0b" strokeWidth="0.7" fill="none" />

          {/* === LEFT EYE - squinting, furious, locked on === */}
          <ellipse cx="-7" cy="0" rx="5" ry="4" fill="#f59e0b" />
          <ellipse cx="-7" cy="0" rx="4" ry="3" fill="#e68a00" />
          {/* Pupil - small, focused, predatory */}
          <circle cx="-6" cy="0" r="2" fill="#1b0f0b" />
          {/* Glint */}
          <circle cx="-5" cy="-1" r="0.7" fill="#fff" opacity="0.9" />
          {/* HEAVY upper eyelid - half-closed, seething with rage */}
          <path d="M-12,-1 Q-8,-5 -3,-2 Q-2,-1 -2,0 Q-5,-2 -8,-2 Q-10,-1.5 -12,0 Z" fill="#1b0f0b" />
          {/* Lower eyelid - pushed up, squinting hard */}
          <path d="M-12,1 Q-8,4 -3,2 Q-5,3 -8,3 Q-10,2.5 -12,1.5 Z" fill="#3e2723" />
          {/* Crow's feet wrinkles */}
          <path d="M-12,0 L-15,0" stroke="#1b0f0b" strokeWidth="0.7" fill="none" />
          <path d="M-12,-1 L-15,-2" stroke="#1b0f0b" strokeWidth="0.6" fill="none" />
          <path d="M-12,1 L-14,2" stroke="#1b0f0b" strokeWidth="0.6" fill="none" />

          {/* === RIGHT EYE - matching fury === */}
          <ellipse cx="7" cy="0" rx="5" ry="4" fill="#f59e0b" />
          <ellipse cx="7" cy="0" rx="4" ry="3" fill="#e68a00" />
          <circle cx="6" cy="0" r="2" fill="#1b0f0b" />
          <circle cx="5" cy="-1" r="0.7" fill="#fff" opacity="0.9" />
          {/* Upper eyelid */}
          <path d="M12,-1 Q8,-5 3,-2 Q2,-1 2,0 Q5,-2 8,-2 Q10,-1.5 12,0 Z" fill="#1b0f0b" />
          {/* Lower eyelid */}
          <path d="M12,1 Q8,4 3,2 Q5,3 8,3 Q10,2.5 12,1.5 Z" fill="#3e2723" />
          {/* Crow's feet */}
          <path d="M12,0 L15,0" stroke="#1b0f0b" strokeWidth="0.7" fill="none" />
          <path d="M12,-1 L15,-2" stroke="#1b0f0b" strokeWidth="0.6" fill="none" />
          <path d="M12,1 L14,2" stroke="#1b0f0b" strokeWidth="0.6" fill="none" />

          {/* === BEAK - sharp hooked, open, screaming === */}
          {/* Upper mandible */}
          <path d="M-5,6 Q-2,5 0,6 Q2,5 5,6 L2,16 Q0,18 -2,16 Z" fill="#d4930d" />
          {/* Hook at tip */}
          <path d="M-1,16 Q0,20 1,16" fill="#a16f09" />
          <path d="M0,18 Q0.5,20 0,21" fill="#8a5c08" />
          {/* Ridge line */}
          <line x1="0" y1="7" x2="0" y2="16" stroke="#a16f09" strokeWidth="0.8" />
          {/* Nostrils - cere area */}
          <ellipse cx="-2" cy="8" rx="1" ry="0.6" fill="#c4830c" />
          <ellipse cx="2" cy="8" rx="1" ry="0.6" fill="#c4830c" />
          {/* Open mouth sides - showing dark interior */}
          <path d="M-5,8 Q-6,10 -7,12 Q-4,11 -3,10 Z" fill="#1b0f0b" opacity="0.6" />
          <path d="M5,8 Q6,10 7,12 Q4,11 3,10 Z" fill="#1b0f0b" opacity="0.6" />
          {/* Jaw line crease */}
          <path d="M-5,7 Q-6,9 -7,12" stroke="#5d4037" strokeWidth="0.6" fill="none" />
          <path d="M5,7 Q6,9 7,12" stroke="#5d4037" strokeWidth="0.6" fill="none" />
        </g>

        {/* ── TAIL - fanned below ── */}
        <g transform="translate(0, 32)">
          <path d="M-3,0 Q-8,18 -22,38 Q-16,36 -10,28 Q-6,18 -3,6 Z" fill="#3e2723" />
          <path d="M-1,0 Q-4,20 -12,40 Q-8,38 -4,28 Q-2,18 -1,6 Z" fill="#5d4037" />
          <path d="M1,0 Q4,20 12,40 Q8,38 4,28 Q2,18 1,6 Z" fill="#5d4037" />
          <path d="M3,0 Q8,18 22,38 Q16,36 10,28 Q6,18 3,6 Z" fill="#3e2723" />
          <path d="M-1,2 Q0,22 0,42 Q0,22 1,2 Z" fill="#1b0f0b" opacity="0.3" />
          {/* Tail barring - realistic banding */}
          <path d="M-16,28 Q0,32 16,28" stroke="#1b0f0b" strokeWidth="0.8" fill="none" opacity="0.3" />
          <path d="M-12,22 Q0,25 12,22" stroke="#1b0f0b" strokeWidth="0.7" fill="none" opacity="0.25" />
        </g>

        {/* ── LEFT LEG & TALONS ── */}
        <g transform="translate(-16, 24)">
          {/* Feathered thigh */}
          <path d="M2,-2 Q8,0 12,8 Q10,12 4,10 Q0,6 0,0 Z" fill="#5d4037" />
          <path d="M4,2 L6,8" stroke="#795548" strokeWidth="0.5" opacity="0.5" />
          <path d="M6,2 L8,8" stroke="#795548" strokeWidth="0.5" opacity="0.5" />
          {/* Scaled tarsus */}
          <path d="M8,8 Q4,18 2,28" stroke="#d4930d" strokeWidth="3.5" fill="none" />
          {/* Realistic scales */}
          <path d="M6,12 Q5,13 6,14" stroke="#c4830c" strokeWidth="0.7" fill="none" />
          <path d="M5,16 Q4,17 5,18" stroke="#c4830c" strokeWidth="0.7" fill="none" />
          <path d="M4,20 Q3,21 4,22" stroke="#c4830c" strokeWidth="0.7" fill="none" />
          <path d="M3,24 Q2,25 3,26" stroke="#c4830c" strokeWidth="0.7" fill="none" />

          {/* Foot pad */}
          <circle cx="2" cy="30" r="3" fill="#d4930d" />

          {/* TALON 1 - front inner, long deadly curve */}
          <path d="M3,30 Q8,36 10,42 Q12,48 10,54" stroke="#1b0f0b" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M10,54 Q9,57 7,55" stroke="#1b0f0b" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* TALON 2 - front center */}
          <path d="M1,32 Q-2,40 -4,48 Q-5,54 -4,58" stroke="#1b0f0b" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M-4,58 Q-5,61 -7,59" stroke="#1b0f0b" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* TALON 3 - front outer, splayed wide */}
          <path d="M0,30 Q-8,34 -14,40 Q-20,46 -22,52" stroke="#1b0f0b" strokeWidth="2.8" fill="none" strokeLinecap="round" />
          <path d="M-22,52 Q-23,55 -25,53" stroke="#1b0f0b" strokeWidth="1.8" fill="none" strokeLinecap="round" />

          {/* TALON 4 - back hallux */}
          <path d="M4,28 Q10,24 14,18 Q16,14 18,10" stroke="#1b0f0b" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M18,10 Q19,7 17,8" stroke="#1b0f0b" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>

        {/* ── RIGHT LEG & TALONS ── */}
        <g transform="translate(16, 24)">
          {/* Feathered thigh */}
          <path d="M-2,-2 Q-8,0 -12,8 Q-10,12 -4,10 Q0,6 0,0 Z" fill="#5d4037" />
          <path d="M-4,2 L-6,8" stroke="#795548" strokeWidth="0.5" opacity="0.5" />
          <path d="M-6,2 L-8,8" stroke="#795548" strokeWidth="0.5" opacity="0.5" />
          {/* Scaled tarsus */}
          <path d="M-8,8 Q-4,18 -2,28" stroke="#d4930d" strokeWidth="3.5" fill="none" />
          {/* Realistic scales */}
          <path d="M-6,12 Q-5,13 -6,14" stroke="#c4830c" strokeWidth="0.7" fill="none" />
          <path d="M-5,16 Q-4,17 -5,18" stroke="#c4830c" strokeWidth="0.7" fill="none" />
          <path d="M-4,20 Q-3,21 -4,22" stroke="#c4830c" strokeWidth="0.7" fill="none" />
          <path d="M-3,24 Q-2,25 -3,26" stroke="#c4830c" strokeWidth="0.7" fill="none" />

          {/* Foot pad */}
          <circle cx="-2" cy="30" r="3" fill="#d4930d" />

          {/* TALON 1 - front inner */}
          <path d="M-3,30 Q-8,36 -10,42 Q-12,48 -10,54" stroke="#1b0f0b" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M-10,54 Q-9,57 -7,55" stroke="#1b0f0b" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* TALON 2 - front center */}
          <path d="M-1,32 Q2,40 4,48 Q5,54 4,58" stroke="#1b0f0b" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M4,58 Q5,61 7,59" stroke="#1b0f0b" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* TALON 3 - outer splayed */}
          <path d="M0,30 Q8,34 14,40 Q20,46 22,52" stroke="#1b0f0b" strokeWidth="2.8" fill="none" strokeLinecap="round" />
          <path d="M22,52 Q23,55 25,53" stroke="#1b0f0b" strokeWidth="1.8" fill="none" strokeLinecap="round" />

          {/* TALON 4 - back hallux */}
          <path d="M-4,28 Q-10,24 -14,18 Q-16,14 -18,10" stroke="#1b0f0b" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M-18,10 Q-19,7 -17,8" stroke="#1b0f0b" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      </g>

      {/* === BEE - bottom right, fleeing === */}
      <g transform="translate(168, 182) scale(0.65)">
        {/* Wings */}
        <ellipse cx="18" cy="-6" rx="10" ry="6" fill="#fffbeb" stroke="#d4930d" strokeWidth="0.8" opacity="0.6" transform="rotate(-25, 18, -6)" />
        <ellipse cx="14" cy="-9" rx="8" ry="5" fill="#fffbeb" stroke="#d4930d" strokeWidth="0.8" opacity="0.6" transform="rotate(-40, 14, -9)" />
        {/* Body */}
        <ellipse cx="20" cy="5" rx="12" ry="8" fill="#f59e0b" />
        {/* Stripes */}
        <rect x="13" y="2" width="14" height="2.5" rx="1.2" fill="#1b0f0b" />
        <rect x="14" y="7" width="12" height="2.5" rx="1.2" fill="#1b0f0b" />
        {/* Head */}
        <circle cx="33" cy="5" r="5" fill="#1b0f0b" />
        {/* Eye */}
        <circle cx="36" cy="3.5" r="1.3" fill="#f59e0b" />
        <circle cx="36.5" cy="3" r="0.5" fill="#1b0f0b" />
        {/* Antennae */}
        <path d="M36,0 Q39,-5 41,-7" stroke="#1b0f0b" strokeWidth="1" fill="none" strokeLinecap="round" />
        <path d="M35,-1 Q37,-6 36,-9" stroke="#1b0f0b" strokeWidth="1" fill="none" strokeLinecap="round" />
        <circle cx="41" cy="-7.5" r="1" fill="#1b0f0b" />
        <circle cx="36" cy="-9.5" r="1" fill="#1b0f0b" />
        {/* Stinger */}
        <polygon points="8,5 2,3 2,7" fill="#1b0f0b" />
        {/* Motion lines */}
        <line x1="42" y1="1" x2="50" y2="0" stroke="#d4930d" strokeWidth="0.8" opacity="0.35" strokeLinecap="round" />
        <line x1="42" y1="5" x2="52" y2="5" stroke="#d4930d" strokeWidth="0.8" opacity="0.35" strokeLinecap="round" />
        <line x1="42" y1="9" x2="49" y2="10" stroke="#d4930d" strokeWidth="0.8" opacity="0.35" strokeLinecap="round" />
      </g>

      {/* Honeycomb accents */}
      <g transform="translate(14, 190)" opacity="0.18">
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
