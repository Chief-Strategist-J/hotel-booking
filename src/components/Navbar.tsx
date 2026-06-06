'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { href: '/', label: 'Home' },
  { href: '/rooms', label: 'Rooms' },
  { href: '/#amenities', label: 'Amenities' },
  { href: '/#contact', label: 'Contact' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    handler()
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-white'
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex justify-between items-center h-16">
        <Link href="/" className="flex items-baseline gap-1.5 shrink-0">
          <span className="font-serif text-xl font-bold text-primary">GrandStay</span>
          <span className="text-gold font-serif font-semibold">Hotel</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-gray-600 hover:text-primary transition-colors relative
                after:absolute after:-bottom-0.5 after:left-0 after:w-0 hover:after:w-full
                after:h-0.5 after:bg-gold after:transition-all after:duration-300 after:rounded-full"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/rooms"
            className="bg-gold hover:bg-gold-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 hover:shadow-md active:scale-95"
          >
            Book Now
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5 text-gray-700" /> : <Menu className="h-5 w-5 text-gray-700" />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          'md:hidden overflow-hidden transition-all duration-300 ease-in-out',
          open ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="border-t border-gray-100 bg-white px-4 py-3 space-y-0.5 shadow-lg">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="flex items-center text-sm font-medium text-gray-700 hover:text-primary hover:bg-primary-50 py-3 px-3 rounded-lg transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-2 pb-1">
            <Link
              href="/rooms"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center bg-gold hover:bg-gold-600 text-white text-sm font-semibold py-3 px-4 rounded-xl transition-colors w-full"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
