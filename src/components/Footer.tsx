import Link from 'next/link'
import { MapPin, Phone, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer id="contact" className="bg-primary text-white">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-serif text-xl font-bold mb-2">GrandStay Hotel</h3>
          <p className="text-blue-200 text-sm leading-relaxed">Experience luxury and comfort in the heart of the city.</p>
        </div>
        <div>
          <h4 className="font-semibold text-amber-400 mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm text-blue-200">
            {['/', '/rooms', '/#amenities'].map((href, i) => (
              <li key={href}><Link href={href} className="hover:text-white transition-colors">{['Home', 'Rooms', 'Amenities'][i]}</Link></li>
            ))}
          </ul>
        </div>
        <div id="contact-info">
          <h4 className="font-semibold text-amber-400 mb-3">Contact</h4>
          <ul className="space-y-2 text-sm text-blue-200">
            <li className="flex gap-2"><MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" /><span>123 Hotel Street, Victoria Island, Lagos</span></li>
            <li className="flex gap-2"><Phone className="h-4 w-4" /><a href="tel:+2340000000000" className="hover:text-white">+234 000 000 0000</a></li>
            <li className="flex gap-2"><Mail className="h-4 w-4" /><a href="mailto:info@grandstay.com" className="hover:text-white">info@grandstay.com</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-blue-800 py-4 text-center text-xs text-blue-300">
        &copy; 2026 GrandStay Hotel. All rights reserved.
      </div>
    </footer>
  )
}
