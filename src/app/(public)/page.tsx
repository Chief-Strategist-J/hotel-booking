import Link from 'next/link'
import { Wifi, Waves, UtensilsCrossed, Car, Dumbbell } from 'lucide-react'
import { getRooms } from '@/features/rooms/actions'
import { RoomCard } from '@/features/rooms/RoomCard'

const amenities = [
  { icon: Wifi, label: 'Free WiFi' },
  { icon: Waves, label: 'Swimming Pool' },
  { icon: UtensilsCrossed, label: 'Restaurant' },
  { icon: Car, label: 'Free Parking' },
  { icon: Dumbbell, label: 'Fitness Center' },
]

const testimonials = [
  { name: 'Sarah M.', text: 'Absolutely wonderful stay. The rooms were spotless and the staff incredibly welcoming.', rating: 5 },
  { name: 'James O.', text: 'Best hotel experience in Lagos. Will definitely be returning on my next visit!', rating: 5 },
  { name: 'Amina K.', text: 'The suite was perfect for our anniversary. Loved every moment of our stay.', rating: 5 },
]

export default async function HomePage() {
  const rooms = await getRooms()
  const featured = rooms.filter((r) => r.status === 'AVAILABLE').slice(0, 3)

  return (
    <>
      {/* Hero */}
      <section className="relative bg-primary text-white min-h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 to-primary/70" />
        <div className="relative max-w-6xl mx-auto px-4 py-24">
          <p className="text-amber-400 font-medium mb-3 tracking-widest text-sm uppercase">Welcome to</p>
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-4 leading-tight">GrandStay Hotel</h1>
          <p className="text-xl text-blue-100 mb-8 max-w-xl">Where luxury meets comfort. Experience world-class hospitality in the heart of Lagos.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/rooms" className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-4 rounded-xl transition-colors inline-block text-center">Book Your Stay</Link>
            <Link href="#about" className="border border-white text-white hover:bg-white hover:text-primary font-semibold px-8 py-4 rounded-xl transition-colors inline-block text-center">Learn More</Link>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-amber-500 font-medium mb-2 uppercase tracking-wide text-sm">About Us</p>
            <h2 className="text-4xl font-bold text-primary mb-4">A Legacy of Luxury</h2>
            <p className="text-gray-600 leading-relaxed mb-6">GrandStay Hotel offers an unparalleled hospitality experience. Nestled in the vibrant heart of Victoria Island, we blend modern elegance with warm, personalised service to create memories that last a lifetime.</p>
            <ul className="space-y-2 text-gray-700">
              {['Prime Victoria Island location', 'World-class dining & spa', '24/7 concierge service', 'Business & events facilities'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm"><span className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0" />{item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-100 rounded-2xl h-72 flex items-center justify-center text-gray-400 text-sm">Hotel Image</div>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-amber-500 font-medium uppercase tracking-wide text-sm mb-2">Our Rooms</p>
            <h2 className="text-4xl font-bold text-primary">Featured Accommodations</h2>
          </div>
          {featured.length ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featured.map((room) => <RoomCard key={room.id} room={room as any} />)}
            </div>
          ) : (
            <p className="text-center text-gray-500">No rooms available. Add rooms from the admin panel.</p>
          )}
          <div className="text-center mt-8">
            <Link href="/rooms" className="inline-block border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold px-8 py-3 rounded-xl transition-colors">View All Rooms</Link>
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section id="amenities" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-amber-500 font-medium uppercase tracking-wide text-sm mb-2">What We Offer</p>
            <h2 className="text-4xl font-bold text-primary">Hotel Amenities</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {amenities.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-3 p-6 bg-gray-50 rounded-xl hover:bg-primary hover:text-white transition-colors group">
                <Icon className="h-8 w-8 text-amber-500 group-hover:text-amber-300" />
                <span className="text-sm font-medium text-center">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-amber-400 font-medium uppercase tracking-wide text-sm mb-2">Guest Reviews</p>
            <h2 className="text-4xl font-bold">What Our Guests Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white/10 rounded-xl p-6">
                <p className="text-amber-400 text-lg mb-1">{'★'.repeat(t.rating)}</p>
                <p className="text-blue-100 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <p className="font-semibold text-sm">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
