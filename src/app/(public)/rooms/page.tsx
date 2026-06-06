import type { Metadata } from 'next'
import { getRooms, getAvailableRooms } from '@/features/rooms/actions'
import { RoomCard } from '@/features/rooms/RoomCard'
import { AvailabilityChecker } from '@/features/rooms/AvailabilityChecker'
import { BedDouble } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Rooms & Suites',
  description:
    'Browse our range of luxury rooms — Standard, Deluxe, Suite, Family and Penthouse. Check availability for your dates and book directly for the best rates.',
  openGraph: {
    title: 'Rooms & Suites | GrandStay Hotel Lagos',
    description: 'Luxury rooms and suites in Victoria Island, Lagos. Book direct for best rates.',
    images: [{ url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&auto=format&fit=crop&q=80', width: 1200, height: 630 }],
  },
}

export default async function RoomsPage({ searchParams }: { searchParams: { checkIn?: string; checkOut?: string } }) {
  const { checkIn, checkOut } = searchParams
  const rooms = checkIn && checkOut ? await getAvailableRooms(checkIn, checkOut) : await getRooms()
  const visible = rooms.filter((r) => r.status === 'AVAILABLE')

  return (
    <div>
      {/* Header */}
      <div className="bg-primary py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-gold text-xs font-semibold uppercase tracking-[0.2em] mb-3">Accommodations</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white leading-tight">
            Rooms & Suites
          </h1>
          <p className="text-blue-200 mt-3 text-base max-w-lg">
            Every room is thoughtfully designed for your comfort. Select your dates to check availability.
          </p>
        </div>
      </div>

      {/* Sticky availability bar */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-16 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <AvailabilityChecker defaultCheckIn={checkIn} defaultCheckOut={checkOut} layout="row" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        {/* Active filter notice */}
        {checkIn && checkOut && (
          <div className="flex items-center justify-between mb-8 bg-primary-50 rounded-xl px-4 py-3 border border-primary-100 gap-4">
            <p className="text-sm text-primary font-medium min-w-0">
              Showing available rooms for{' '}
              <strong className="whitespace-nowrap">{checkIn}</strong>
              {' → '}
              <strong className="whitespace-nowrap">{checkOut}</strong>
              {' '}
              <span className="text-primary/70">({visible.length} found)</span>
            </p>
            <a href="/rooms" className="text-xs text-primary underline font-semibold shrink-0">
              Clear dates
            </a>
          </div>
        )}

        {visible.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {visible.map((room) => (
              <RoomCard key={room.id} room={room as any} checkIn={checkIn} checkOut={checkOut} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <BedDouble className="h-7 w-7 text-gray-400" />
            </div>
            <p className="text-lg font-semibold text-gray-700 mb-1">No rooms available for these dates</p>
            <p className="text-gray-500 text-sm mb-6">Try different dates or browse all rooms.</p>
            <a
              href="/rooms"
              className="inline-flex items-center bg-primary hover:bg-primary-800 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors"
            >
              Browse All Rooms
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
