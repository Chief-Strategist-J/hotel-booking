'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { formatCurrency, calculateNights } from '@/lib/utils'
import { createBooking } from './actions'
import type { Room } from '@/features/rooms/types'

type FormData = {
  guestName: string; guestEmail: string; guestPhone: string
  guests: number; specialRequests: string; paymentMethod: 'ONLINE' | 'PAY_AT_HOTEL'
}

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
          body: JSON.stringify({ bookingId: booking.id, email: data.guestEmail, amount: total }),
        })
        const json = await res.json()
        if (json.authorization_url) { window.location.href = json.authorization_url; return }
        throw new Error('Payment init failed')
      }
      router.push(`/booking/confirmation?ref=${booking.bookingReference}`)
    } catch (e: any) {
      toast.error(e.message || 'Booking failed. Try again.')
    } finally { setLoading(false) }
  }

  const field = (label: string, name: keyof FormData, type = 'text', extra?: object) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input type={type} {...register(name as any, { required: 'Required', ...extra })}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
      {errors[name] && <p className="text-red-500 text-xs mt-1">{(errors[name] as any)?.message}</p>}
    </div>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">Guest Information</h3>
        {field('Full Name', 'guestName')}
        {field('Email Address', 'guestEmail', 'email')}
        {field('Phone Number', 'guestPhone', 'tel')}
        {field('Number of Guests', 'guests', 'number', { min: 1, max: room.capacity, valueAsNumber: true })}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests (optional)</label>
          <textarea rows={2} {...register('specialRequests')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Payment Method</h3>
        <div className="grid grid-cols-2 gap-3">
          {(['ONLINE', 'PAY_AT_HOTEL'] as const).map((m) => (
            <label key={m} className={`flex items-center gap-2 p-3 border-2 rounded-xl cursor-pointer ${method === m ? 'border-primary bg-primary/5' : 'border-gray-200'}`}>
              <input type="radio" value={m} {...register('paymentMethod')} className="sr-only" />
              <span className={`w-3 h-3 rounded-full border-2 ${method === m ? 'bg-primary border-primary' : 'border-gray-400'}`} />
              <div>
                <p className="text-sm font-medium">{m === 'ONLINE' ? 'Pay Online' : 'Pay at Hotel'}</p>
                <p className="text-xs text-gray-500">{m === 'ONLINE' ? 'Secure card' : 'On arrival'}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 border text-sm">
        <p className="font-semibold text-gray-900 mb-2">Booking Summary</p>
        <div className="space-y-1 text-gray-600">
          <div className="flex justify-between"><span>Room</span><span className="font-medium">{room.name}</span></div>
          <div className="flex justify-between"><span>Check-in</span><span>{checkIn}</span></div>
          <div className="flex justify-between"><span>Check-out</span><span>{checkOut}</span></div>
          <div className="flex justify-between"><span>{nights} night{nights !== 1 ? 's' : ''}</span><span>{formatCurrency(total)}</span></div>
          <div className="border-t pt-2 flex justify-between font-bold text-gray-900 text-base">
            <span>Total</span><span className="text-primary">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      <button type="submit" disabled={loading} className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors">
        {loading ? 'Processing...' : method === 'ONLINE' ? 'Proceed to Payment' : 'Confirm Booking'}
      </button>
    </form>
  )
}
