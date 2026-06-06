import Link from 'next/link'
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react'

export function Footer() {
  return (
    <footer id="contact" className="bg-primary-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="sm:col-span-2 md:col-span-1">
          <h3 className="font-serif text-2xl font-bold mb-1">GrandStay</h3>
          <p className="text-gold text-sm font-medium mb-3">Hotel & Suites</p>
          <p className="text-blue-300 text-sm leading-relaxed">
            Experience luxury and comfort in the heart of Lagos, Nigeria.
          </p>
          <div className="flex gap-3 mt-5">
            {[Facebook, Instagram, Twitter].map((Icon, i) => (
              <a key={i} href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-gold/80 flex items-center justify-center transition-colors">
                <Icon className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-2.5">
            {[['/', 'Home'], ['/rooms', 'Our Rooms'], ['/#amenities', 'Amenities'], ['/#about', 'About Us']].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="text-sm text-blue-300 hover:text-gold transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Rooms */}
        <div>
          <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Room Types</h4>
          <ul className="space-y-2.5">
            {['Standard Room', 'Deluxe Room', 'Executive Suite', 'Family Room', 'Penthouse Suite'].map((name) => (
              <li key={name}>
                <Link href="/rooms" className="text-sm text-blue-300 hover:text-gold transition-colors">
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div id="contact-info">
          <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Contact</h4>
          <ul className="space-y-3">
            <li className="flex gap-3 text-sm text-blue-300">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-gold" />
              <span>123 Hotel Street, Victoria Island, Lagos</span>
            </li>
            <li className="flex gap-3 text-sm text-blue-300">
              <Phone className="h-4 w-4 flex-shrink-0 text-gold" />
              <a href="tel:+2340000000000" className="hover:text-gold transition-colors">+234 000 000 0000</a>
            </li>
            <li className="flex gap-3 text-sm text-blue-300">
              <Mail className="h-4 w-4 flex-shrink-0 text-gold" />
              <a href="mailto:info@grandstay.com" className="hover:text-gold transition-colors">info@grandstay.com</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-blue-400">
        &copy; {new Date().getFullYear()} GrandStay Hotel & Suites. All rights reserved.
      </div>
    </footer>
  )
}
