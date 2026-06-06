import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Wifi, Waves, UtensilsCrossed, Car, Dumbbell, Award, Users, Star, Clock } from 'lucide-react'
import { getRooms } from '@/features/rooms/actions'
import { RoomCard } from '@/features/rooms/RoomCard'

export const metadata: Metadata = {
  title: 'GrandStay Hotel & Suites | Luxury Hotel in Lagos, Nigeria',
  description:
    'Welcome to GrandStay Hotel, Victoria Island Lagos. Book luxury rooms online — Deluxe, Suite, Family & Penthouse rooms. Best rates guaranteed. 24/7 concierge.',
  openGraph: {
    title: 'GrandStay Hotel & Suites | Victoria Island, Lagos',
    description: 'Luxury hotel with world-class amenities in the heart of Lagos. Book direct for best rates.',
    images: [{ url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&auto=format&fit=crop&q=80', width: 1200, height: 630, alt: 'GrandStay Hotel' }],
  },
}

const amenities = [
  { icon: Wifi,            label: 'High-Speed WiFi',  desc: 'Complimentary throughout' },
  { icon: Waves,           label: 'Swimming Pool',     desc: 'Heated infinity pool' },
  { icon: UtensilsCrossed, label: 'Fine Dining',       desc: 'Award-winning restaurant' },
  { icon: Car,             label: 'Valet Parking',     desc: 'Secure, complimentary' },
  { icon: Dumbbell,        label: 'Fitness Center',    desc: 'Open 24 hours' },
]

const testimonials = [
  { name: 'Sarah M.', role: 'Business Traveller', avatar: 'S', text: 'Absolutely wonderful stay. The rooms were spotless and the staff incredibly welcoming. I will be back every time I visit Lagos.', rating: 5 },
  { name: 'James O.', role: 'Leisure Guest',       avatar: 'J', text: 'Best hotel experience in Lagos. The service exceeded every expectation. The suite was worth every naira.', rating: 5 },
  { name: 'Amina K.', role: 'Honeymooner',         avatar: 'A', text: 'The penthouse was perfect for our anniversary. The team went above and beyond to make our stay magical.', rating: 5 },
]

const stats = [
  { icon: Award, value: '15+', label: 'Years of Excellence' },
  { icon: Users, value: '50k+', label: 'Happy Guests' },
  { icon: Star,  value: '4.9',  label: 'Average Rating' },
  { icon: Clock, value: '24/7', label: 'Guest Support' },
]

export default async function HomePage() {
  const rooms = await getRooms()
  const featured = rooms.filter((r) => r.status === 'AVAILABLE').slice(0, 3)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: 'GrandStay Hotel & Suites',
    description: 'Luxury hotel in Victoria Island, Lagos, Nigeria.',
    url: 'https://hotel-sandy-gamma.vercel.app',
    telephone: '+2340000000000',
    email: 'info@grandstay.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Hotel Street',
      addressLocality: 'Victoria Island',
      addressRegion: 'Lagos',
      addressCountry: 'NG',
    },
    starRating: { '@type': 'Rating', ratingValue: '5' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '847' },
    amenityFeature: amenities.map((a) => ({ '@type': 'LocationFeatureSpecification', name: a.label, value: true })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── Hero ── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-primary-900">
        <Image
          src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1600&auto=format&fit=crop&q=80"
          alt="GrandStay Hotel exterior"
          fill
          className="object-cover opacity-40"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/95 via-primary-900/75 to-primary-900/30" />

        <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <p className="text-gold text-xs font-semibold uppercase tracking-[0.25em] mb-4">Welcome to</p>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-8xl font-bold text-white mb-5 leading-[1.05] tracking-tight">
            GrandStay<br />
            <span className="text-gold">Hotel</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100/90 mb-10 max-w-lg leading-relaxed">
            Where luxury meets comfort. Experience world-class hospitality in the heart of Victoria Island, Lagos.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              href="/rooms"
              className="inline-flex items-center justify-center bg-gold hover:bg-gold-600 text-white font-semibold text-base px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-xl active:scale-95"
            >
              Book Your Stay
            </Link>
            <Link
              href="#about"
              className="inline-flex items-center justify-center border-2 border-white/60 text-white hover:bg-white hover:text-primary font-semibold text-base px-8 py-4 rounded-xl transition-all duration-200 active:scale-95"
            >
              Explore Hotel
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
          <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
          <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="bg-primary py-8 md:py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <Icon className="h-5 w-5 text-gold" />
              </div>
              <div className="min-w-0">
                <p className="text-xl md:text-2xl font-bold text-white font-serif">{value}</p>
                <p className="text-xs text-blue-300 truncate">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="py-20 md:py-28 bg-white scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-10 md:gap-20 items-center">
          <div>
            <p className="text-gold text-xs font-semibold uppercase tracking-[0.2em] mb-3">About Us</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-6 leading-tight">
              A Legacy of<br />Luxury
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              GrandStay Hotel offers an unparalleled hospitality experience. Nestled in the vibrant heart of Victoria Island, we blend modern elegance with warm, personalised service to create memories that last a lifetime.
            </p>
            <ul className="space-y-3 mb-8">
              {['Prime Victoria Island location', 'World-class dining & spa', '24/7 concierge service', 'Business & events facilities'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-gray-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/rooms"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-800 text-white font-semibold px-7 py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg active:scale-95 text-sm"
            >
              Explore Our Rooms
            </Link>
          </div>

          {/* Image with floating badge — prevent badge from being clipped */}
          <div className="relative h-72 md:h-[480px]">
            <div className="relative rounded-3xl overflow-hidden h-full w-full shadow-[0_20px_60px_-10px_rgba(26,60,94,.25)]">
              <Image
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80"
                alt="GrandStay Hotel interior"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            {/* Floating badge sits outside overflow-hidden container */}
            <div className="absolute bottom-6 left-6 bg-white rounded-2xl px-5 py-4 shadow-xl border border-gray-100 z-10">
              <p className="font-serif text-2xl font-bold text-primary leading-none">4.9 ★</p>
              <p className="text-xs text-gray-500 mt-1">Guest satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Rooms ── */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-gold text-xs font-semibold uppercase tracking-[0.2em] mb-3">Our Rooms</p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary leading-tight">
                Featured<br className="hidden sm:block" /> Accommodations
              </h2>
            </div>
            <Link
              href="/rooms"
              className="inline-flex items-center gap-2 border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 text-sm self-start sm:self-auto shrink-0"
            >
              View All Rooms
            </Link>
          </div>

          {featured.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {featured.map((room) => <RoomCard key={room.id} room={room as any} />)}
            </div>
          ) : (
            <p className="text-center text-gray-400 py-16 text-sm">No rooms available yet.</p>
          )}
        </div>
      </section>

      {/* ── Amenities ── */}
      <section id="amenities" className="py-20 md:py-28 bg-white scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-gold text-xs font-semibold uppercase tracking-[0.2em] mb-3">What We Offer</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary">Hotel Amenities</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-5">
            {amenities.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="group flex flex-col items-center text-center gap-3 p-5 md:p-6 rounded-2xl border border-gray-100 hover:border-primary hover:bg-primary transition-all duration-300 cursor-default"
              >
                <div className="w-12 h-12 rounded-xl bg-gold/10 group-hover:bg-white/15 flex items-center justify-center transition-colors flex-shrink-0">
                  <Icon className="h-6 w-6 text-gold group-hover:text-white transition-colors" />
                </div>
                <div className="min-w-0 w-full">
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-white transition-colors leading-snug">{label}</p>
                  <p className="text-xs text-gray-500 group-hover:text-blue-200 mt-1 transition-colors">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 md:py-28 bg-primary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-gold text-xs font-semibold uppercase tracking-[0.2em] mb-3">Guest Reviews</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white">What Our Guests Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white/[0.08] backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10 hover:bg-white/[0.13] transition-colors"
              >
                <p className="text-gold text-lg mb-5 tracking-wider">{'★'.repeat(t.rating)}</p>
                <p className="text-blue-100/90 text-sm leading-relaxed mb-7">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/25 flex items-center justify-center flex-shrink-0">
                    <span className="text-gold font-bold text-sm">{t.avatar}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-white text-sm truncate">{t.name}</p>
                    <p className="text-blue-300 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-gold-50 border-t border-gold-100">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-gold text-xs font-semibold uppercase tracking-[0.2em] mb-3">Limited Availability</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-5 leading-tight">
            Ready for an<br />Unforgettable Stay?
          </h2>
          <p className="text-gray-600 mb-8 text-base">
            Check availability and book your room today. Best rates guaranteed when you book direct.
          </p>
          <Link
            href="/rooms"
            className="inline-flex items-center justify-center bg-gold hover:bg-gold-600 text-white font-semibold text-base px-10 py-4 rounded-xl transition-all duration-200 hover:shadow-xl active:scale-95"
          >
            Book Your Room
          </Link>
        </div>
      </section>
    </>
  )
}
