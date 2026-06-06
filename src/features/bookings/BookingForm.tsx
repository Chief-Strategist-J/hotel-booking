'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { CreditCard, Building2, User, Mail, Phone, Users, MessageSquare } from 'lucide-react'
import { formatCurrency, calculateNights } from '@/lib/utils'
import { createBooking } from './actions'
import type { Room } from '@/features/rooms/types'

type FormData = {
  guestName: string; guestEmail: string; guestPhone: string
  guests: number; specialRequests: string; paymentMethod: 'ONLINE' | 'PAY_AT_HOTEL'
}

const inputCls = 'w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors placeholder:text-gray-400'

export function BookingForm({ room, checkIn, checkOut }: { room: Room; checkIn: string; checkOut: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const nights = calculateNights(checkIn, checkOut)
  const total = Number(room.price) * nights

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: { guests: 1, paymentMethod: 'ONLINE' },
  })
  const method = watch('paymentMethod')

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const booking = await createBooking({ ...data, roomId: room.id, checkIn, checkOut, guests: Number(data.guests) })
      if (data.paymentMethod === 'ONLINE') {
        const res = await fetch('/api/payments/initialize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookingId: booking.id, email: data.guestEmail, amount: total, roomName: room.name }),
        })
        const json = await res.json()
        if (json.authorization_url) { window.location.href = json.authorization_url; return }
        throw new Error(json.error || 'Payment initialisation failed')
      }
      router.push(`/booking/confirmation?ref=${booking.bookingReference}`)
    } catch (e: any) {
      toast.error(e.message || 'Booking failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Guest Information */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">1</span>
          Guest Information
        </h3>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input {...register('guestName', { required: 'Name is required' })} placeholder="John Doe" className={inputCls} />
          </div>
          {errors.guestName && <p className="text-red-500 text-xs mt-1">{errors.guestName.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input type="email" {...register('guestEmail', { required: 'Email is required' })} placeholder="john@example.com" className={inputCls} />
          </div>
          {errors.guestEmail && <p className="text-red-500 text-xs mt-1">{errors.guestEmail.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input type="tel" {...register('guestPhone', { required: 'Phone is required' })} placeholder="+234 800 000 0000" className={inputCls} />
          </div>
          {errors.guestPhone && <p className="text-red-500 text-xs mt-1">{errors.guestPhone.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Number of Guests <span className="text-gray-400 normal-case font-normal">(max {room.capacity})</span>
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="number"
              {...register('guests', { valueAsNumber: true, required: 'Required', min: { value: 1, message: 'At least 1 guest' }, max: { value: room.capacity, message: `Max ${room.capacity} guests` } })}
              className={inputCls}
            />
          </div>
          {errors.guests && <p className="text-red-500 text-xs mt-1">{errors.guests.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Special Requests <span className="text-gray-400 normal-case font-normal">(optional)</span>
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
            <textarea
              rows={3}
              {...register('specialRequests')}
              placeholder="Late check-in, dietary requirements, celebrations..."
              className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors placeholder:text-gray-400 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
          <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">2</span>
          Payment Method
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { value: 'ONLINE',       icon: CreditCard,  title: 'Pay Online',    desc: 'Secure card payment via Stripe' },
            { value: 'PAY_AT_HOTEL', icon: Building2,   title: 'Pay at Hotel',  desc: 'Pay cash or card on arrival' },
          ] as const).map(({ value, icon: Icon, title, desc }) => (
            <label
              key={value}
              className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                method === value ? 'border-primary bg-primary-50' : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <input type="radio" value={value} {...register('paymentMethod')} className="sr-only" />
              <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                method === value ? 'border-primary' : 'border-gray-300'
              }`}>
                {method === value && <div className="w-2 h-2 rounded-full bg-primary" />}
              </div>
              <Icon className={`h-5 w-5 flex-shrink-0 ${method === value ? 'text-primary' : 'text-gray-400'}`} />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 leading-snug">{title}</p>
                <p className="text-xs text-gray-500 leading-snug">{desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-primary-50 rounded-2xl border border-primary-100 p-6">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
          <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">3</span>
          Booking Summary
        </h3>
        <div className="space-y-2 text-sm">
          {[
            ['Room', room.name],
            ['Check-in', checkIn],
            ['Check-out', checkOut],
            [`${nights} night${nights !== 1 ? 's' : ''} × ${formatCurrency(room.price)}`, formatCurrency(total)],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4">
              <span className="text-gray-600 min-w-0 truncate">{label}</span>
              <span className="font-medium text-gray-900 shrink-0">{value}</span>
            </div>
          ))}
          <div className="border-t border-primary-200 pt-3 mt-3 flex justify-between items-center">
            <span className="font-bold text-gray-900">Total</span>
            <span className="text-xl font-bold text-primary font-serif">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gold hover:bg-gold-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-all duration-200 hover:shadow-lg active:scale-[.98] text-base"
      >
        {loading ? 'Processing…' : method === 'ONLINE' ? 'Proceed to Payment' : 'Confirm Booking'}
      </button>

      <p className="text-center text-xs text-gray-400">
        By booking you agree to our terms. Free cancellation within 24 hours.
      </p>
    </form>
  )
}
