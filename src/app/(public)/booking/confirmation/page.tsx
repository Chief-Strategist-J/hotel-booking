import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, CalendarDays, User, Mail, Phone, BedDouble, CreditCard, Home, ArrowRight } from 'lucide-react'
import { getBookingByRef } from '@/features/bookings/actions'
import { BookingBadge, PaymentBadge } from '@/features/bookings/BookingBadges'
import { formatDate, formatCurrency } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Booking Confirmed',
  description: 'Your booking at GrandStay Hotel is confirmed.',
  robots: { index: false },
}

export default async function ConfirmationPage({ searchParams }: { searchParams: { ref?: string } }) {
  const booking = searchParams.ref ? await getBookingByRef(searchParams.ref) : null

  if (!booking) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <p className="text-gray-500 mb-4">Booking not found or link has expired.</p>
        <Link href="/" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-800 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors">
          <Home className="h-4 w-4" /> Go Home
        </Link>
      </div>
    )
  }

  const isReserved = booking.bookingStatus === 'RESERVED'

  return (
    <div className="min-h-screen bg-gray-50/60">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 md:py-16">

        {/* Success header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-green-50 border-4 border-green-100 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {isReserved ? 'Room Reserved!' : 'Booking Confirmed!'}
          </h1>
          <p className="text-gray-500 text-base max-w-sm mx-auto">
            {isReserved
              ? 'Your room is reserved. Please settle payment on arrival.'
              : 'Payment received. Your booking is fully confirmed.'}
          </p>
        </div>

        {/* Reference pill */}
        <div className="bg-primary rounded-2xl p-6 text-center mb-6">
          <p className="text-blue-300 text-xs uppercase tracking-[0.2em] mb-2">Booking Reference</p>
          <p className="text-3xl md:text-4xl font-bold text-white font-mono tracking-widest break-all">
            {booking.bookingReference}
          </p>
          <p className="text-blue-300 text-xs mt-2">Please save this reference for check-in</p>
        </div>

        {/* Details card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
          <h2 className="font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-100">Booking Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { icon: User,         label: 'Guest',          value: booking.guestName },
              { icon: Mail,         label: 'Email',          value: booking.guestEmail },
              { icon: Phone,        label: 'Phone',          value: booking.guestPhone },
              { icon: BedDouble,    label: 'Room',           value: booking.room?.name || '—' },
              { icon: CalendarDays, label: 'Check-in',       value: formatDate(booking.checkIn) },
              { icon: CalendarDays, label: 'Check-out',      value: formatDate(booking.checkOut) },
              { icon: CreditCard,   label: 'Total Amount',   value: formatCurrency(booking.totalAmount) },
              { icon: CreditCard,   label: 'Payment',        value: booking.paymentMethod === 'ONLINE' ? 'Stripe (Online)' : 'Pay at Hotel' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="h-4 w-4 text-gold" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
                  <p className="font-medium text-gray-900 text-sm mt-0.5 break-words">{value}</p>
                </div>
              </div>
            ))}

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CreditCard className="h-4 w-4 text-gold" />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Booking Status</p>
                <div className="mt-1.5"><BookingBadge status={booking.bookingStatus as any} /></div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CreditCard className="h-4 w-4 text-gold" />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Payment Status</p>
                <div className="mt-1.5"><PaymentBadge status={booking.paymentStatus as any} /></div>
              </div>
            </div>
          </div>
        </div>

        {/* Note for pay-at-hotel */}
        {isReserved && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3.5 mb-5 text-sm text-amber-800">
            <strong>Reminder:</strong> Please present your booking reference at check-in and have your payment ready.
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 hover:border-primary hover:text-primary font-semibold py-3.5 rounded-xl transition-all duration-200 text-sm"
          >
            <Home className="h-4 w-4" /> Back to Home
          </Link>
          <Link
            href="/rooms"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-800 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 text-sm"
          >
            Browse More Rooms <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
