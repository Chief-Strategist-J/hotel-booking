'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const links = [
  { href: '/', label: 'Home' },
  { href: '/rooms', label: 'Rooms' },
  { href: '/#amenities', label: 'Amenities' },
  { href: '/#contact', label: 'Contact' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center h-16">
        <Link href="/" className="flex items-baseline gap-1">
          <span className="font-serif text-2xl font-bold text-primary">GrandStay</span>
          <span className="text-amber-500 font-serif font-semibold">Hotel</span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => <Link key={l.href} href={l.href} className="text-sm text-gray-600 hover:text-primary transition-colors">{l.label}</Link>)}
          <Link href="/rooms" className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">Book Now</Link>
        </div>
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
      </div>
      {open && (
        <div className="md:hidden border-t px-4 py-3 space-y-2 bg-white">
          {links.map((l) => <Link key={l.href} href={l.href} className="block text-sm text-gray-600 py-1" onClick={() => setOpen(false)}>{l.label}</Link>)}
          <Link href="/rooms" className="block bg-amber-500 text-white text-sm font-medium px-4 py-2 rounded-lg text-center" onClick={() => setOpen(false)}>Book Now</Link>
        </div>
      )}
    </nav>
  )
}
