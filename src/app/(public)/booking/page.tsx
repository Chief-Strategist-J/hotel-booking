import { redirect } from 'next/navigation'
import { getRoomById, isRoomAvailable } from '@/features/rooms/actions'
import { BookingForm } from '@/features/bookings/BookingForm'
import { formatCurrency, calculateNights } from '@/lib/utils'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Book Your Room' }

export default async function BookingPage({ searchParams }: { searchParams: { roomId?: string; checkIn?: string; checkOut?: string } }) {
  const { roomId, checkIn, checkOut } = searchParams
  if (!roomId || !checkIn || !checkOut) redirect('/rooms')

  const room = await getRoomById(roomId)
  if (!room) redirect('/rooms')

  const available = await isRoomAvailable(roomId, checkIn, checkOut)
  const primary = room.images.find((i) => i.isPrimary) || room.images[0]
  const nights = calculateNights(checkIn, checkOut)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      <h1 className="font-serif text-2xl md:text-3xl font-bold text-primary mb-6 md:mb-8">Complete Your Booking</h1>

      {!available ? (
        <div className="text-center py-16">
          <p className="text-xl font-medium text-gray-700 mb-2">Room unavailable for selected dates</p>
          <a href="/rooms" className="text-primary underline text-sm">Browse other rooms</a>
        </div>
      ) : (
        <div className="grid md:grid-cols-5 gap-6 md:gap-10">
          {/* Room summary — below form on mobile, side panel on desktop */}
          <div className="md:col-span-2 md:order-2">
            <div className="bg-gray-50 rounded-xl overflow-hidden border md:sticky md:top-20">
              <div className="relative h-44 md:h-48">
                {primary
                  ? <Image src={primary.imageUrl} alt={room.name} fill className="object-cover" />
                  : <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">No image</div>
                }
              </div>
              <div className="p-4 md:p-5 text-sm text-gray-700 space-y-2">
                <p className="font-serif text-lg md:text-xl font-bold text-primary">{room.name}</p>
                <p><span className="text-gray-500">Check-in:</span> <span className="font-medium">{checkIn}</span></p>
                <p><span className="text-gray-500">Check-out:</span> <span className="font-medium">{checkOut}</span></p>
                <p><span className="text-gray-500">Duration:</span> <span className="font-medium">{nights} night{nights !== 1 ? 's' : ''}</span></p>
                <p className="border-t pt-2 text-base font-bold text-primary">Total: {formatCurrency(Number(room.price) * nights)}</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-3 md:order-1">
            <BookingForm room={room as any} checkIn={checkIn} checkOut={checkOut} />
          </div>
        </div>
      )}
    </div>
  )
}
