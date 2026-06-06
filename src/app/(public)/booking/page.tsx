import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, CalendarDays, Moon, ShieldCheck, Star } from 'lucide-react'
import { getRoomById, isRoomAvailable } from '@/features/rooms/actions'
import { BookingForm } from '@/features/bookings/BookingForm'
import { formatCurrency, calculateNights } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Book Your Room',
  description: 'Complete your booking at GrandStay Hotel. Secure payment via Stripe.',
  robots: { index: false },
}

export default async function BookingPage({ searchParams }: { searchParams: { roomId?: string; checkIn?: string; checkOut?: string } }) {
  const { roomId, checkIn, checkOut } = searchParams
  if (!roomId || !checkIn || !checkOut) redirect('/rooms')

  const room = await getRoomById(roomId)
  if (!room) redirect('/rooms')

  const available = await isRoomAvailable(roomId, checkIn, checkOut)
  const primary = room.images.find((i) => i.isPrimary) || room.images[0]
  const nights = calculateNights(checkIn, checkOut)

  return (
    <div className="min-h-screen bg-gray-50/60">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href={`/rooms/${roomId}`} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to room
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
            <ShieldCheck className="h-4 w-4" />
            Secure checkout
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-primary mb-8">Complete Your Booking</h1>

        {!available ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <p className="text-xl font-semibold text-gray-700 mb-2">Room unavailable for selected dates</p>
            <p className="text-gray-500 text-sm mb-6">Please choose different dates or browse other rooms.</p>
            <Link href="/rooms" className="inline-flex items-center bg-primary hover:bg-primary-800 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors">
              Browse Rooms
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-5 gap-6 md:gap-10">
            {/* Booking form */}
            <div className="md:col-span-3 md:order-1">
              <BookingForm room={room as any} checkIn={checkIn} checkOut={checkOut} />
            </div>

            {/* Room summary */}
            <div className="md:col-span-2 md:order-2">
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,.08)] md:sticky md:top-[84px]">
                <div className="relative h-48">
                  {primary
                    ? <Image src={primary.imageUrl} alt={room.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 40vw" />
                    : <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">No image</div>
                  }
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="font-serif text-lg font-bold text-white leading-snug">{room.name}</p>
                    <p className="text-white/75 text-sm">{room.type.charAt(0) + room.type.slice(1).toLowerCase()}</p>
                  </div>
                </div>

                <div className="p-5 space-y-3.5">
                  <div className="flex items-center gap-2.5 text-sm text-gray-600">
                    <CalendarDays className="h-4 w-4 text-gold flex-shrink-0" />
                    <span>{checkIn}</span>
                    <span className="text-gray-400">→</span>
                    <span>{checkOut}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-gray-600">
                    <Moon className="h-4 w-4 text-gold flex-shrink-0" />
                    <span>{nights} night{nights !== 1 ? 's' : ''}</span>
                  </div>

                  <div className="border-t border-gray-100 pt-3.5 flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total</span>
                    <span className="text-xl font-bold text-primary font-serif">
                      {formatCurrency(Number(room.price) * nights)}
                    </span>
                  </div>

                  <div className="bg-green-50 rounded-xl px-4 py-3 space-y-1.5">
                    {[
                      { icon: ShieldCheck, text: 'Free cancellation within 24h' },
                      { icon: Star,        text: 'Best rate guaranteed' },
                    ].map(({ icon: Icon, text }) => (
                      <p key={text} className="flex items-center gap-2 text-xs text-green-700">
                        <Icon className="h-3.5 w-3.5 flex-shrink-0" />{text}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
