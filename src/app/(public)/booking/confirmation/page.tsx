import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { getBookingByRef } from '@/features/bookings/actions'
import { BookingBadge, PaymentBadge } from '@/features/bookings/BookingBadges'
import { formatDate, formatCurrency } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Booking Confirmed' }

export default async function ConfirmationPage({ searchParams }: { searchParams: { ref?: string } }) {
  const booking = searchParams.ref ? await getBookingByRef(searchParams.ref) : null

  if (!booking) return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <p className="text-gray-500">Booking not found.</p>
      <Link href="/" className="text-primary underline text-sm mt-2 inline-block">Go Home</Link>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="font-serif text-3xl font-bold text-gray-900">Booking {booking.bookingStatus === 'RESERVED' ? 'Reserved' : 'Confirmed'}!</h1>
        <p className="text-gray-500 mt-2">
          {booking.paymentMethod === 'PAY_AT_HOTEL'
            ? 'Your room is reserved. Please pay upon arrival.'
            : 'Payment received. Your booking is confirmed.'}
        </p>
      </div>

      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <div className="text-center mb-6">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Booking Reference</p>
          <p className="text-2xl font-bold text-primary font-mono">{booking.bookingReference}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {[
            ['Guest', booking.guestName],
            ['Email', booking.guestEmail],
            ['Phone', booking.guestPhone],
            ['Room', booking.room?.name || '-'],
            ['Check-in', formatDate(booking.checkIn)],
            ['Check-out', formatDate(booking.checkOut)],
            ['Total Amount', formatCurrency(booking.totalAmount)],
            ['Payment Method', booking.paymentMethod === 'ONLINE' ? 'Online Payment' : 'Pay at Hotel'],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-gray-500">{label}</p>
              <p className="font-medium text-gray-900">{value}</p>
            </div>
          ))}
          <div>
            <p className="text-gray-500">Booking Status</p>
            <BookingBadge status={booking.bookingStatus as any} />
          </div>
          <div>
            <p className="text-gray-500">Payment Status</p>
            <PaymentBadge status={booking.paymentStatus as any} />
          </div>
        </div>
      </div>

      <div className="flex gap-4 justify-center mt-8">
        <Link href="/" className="border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-6 py-3 rounded-xl transition-colors">Back to Home</Link>
        <Link href="/rooms" className="bg-primary hover:bg-primary/90 text-white font-medium px-6 py-3 rounded-xl transition-colors">Browse More Rooms</Link>
      </div>
    </div>
  )
}
