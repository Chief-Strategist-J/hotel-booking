import { getRooms, getAvailableRooms } from '@/features/rooms/actions'
import { RoomCard } from '@/features/rooms/RoomCard'
import { AvailabilityChecker } from '@/features/rooms/AvailabilityChecker'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Our Rooms' }

export default async function RoomsPage({ searchParams }: { searchParams: { checkIn?: string; checkOut?: string } }) {
  const { checkIn, checkOut } = searchParams
  const rooms = checkIn && checkOut ? await getAvailableRooms(checkIn, checkOut) : await getRooms()
  const visible = rooms.filter((r) => r.status === 'AVAILABLE')

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold text-primary mb-2">Our Rooms</h1>
        <p className="text-gray-600">Choose the perfect room for your stay.</p>
      </div>

      <div className="bg-gray-50 rounded-xl p-6 mb-8">
        <p className="font-medium text-gray-700 mb-4">Check availability for your dates:</p>
        <AvailabilityChecker defaultCheckIn={checkIn} defaultCheckOut={checkOut} />
      </div>

      {checkIn && checkOut && (
        <p className="text-sm text-gray-500 mb-6">
          Showing available rooms for <strong>{checkIn}</strong> &rarr; <strong>{checkOut}</strong>
          {' '}<a href="/rooms" className="text-primary underline">Clear dates</a>
        </p>
      )}

      {visible.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((room) => <RoomCard key={room.id} room={room as any} checkIn={checkIn} checkOut={checkOut} />)}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg font-medium mb-2">No rooms available for these dates</p>
          <a href="/rooms" className="text-primary underline text-sm">Try different dates</a>
        </div>
      )}
    </div>
  )
}
