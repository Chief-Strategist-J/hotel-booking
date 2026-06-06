'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { BookingBadge, PaymentBadge } from '@/features/bookings/BookingBadges'
import { updateBookingStatus } from '@/features/bookings/actions'
import { formatDate, formatCurrency } from '@/lib/utils'
import type { Booking, BookingStatus } from '@/features/bookings/types'

const FILTERS = [
  { key: '', label: 'All' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
]

const ACTIONS: { label: string; status: BookingStatus; cls: string }[] = [
  { label: 'Confirm', status: 'CONFIRMED', cls: 'text-green-700 hover:bg-green-50' },
  { label: 'Check In', status: 'CHECKED_IN', cls: 'text-blue-700 hover:bg-blue-50' },
  { label: 'Check Out', status: 'CHECKED_OUT', cls: 'text-purple-700 hover:bg-purple-50' },
  { label: 'Cancel', status: 'CANCELLED', cls: 'text-red-700 hover:bg-red-50' },
  { label: 'No Show', status: 'NO_SHOW', cls: 'text-gray-700 hover:bg-gray-50' },
]

export function BookingsClient({ bookings, filter }: { bookings: Booking[]; filter?: string }) {
  const router = useRouter()
  const [open, setOpen] = useState<string | null>(null)
  const [loading, setLoading] = useState<string | null>(null)

  const handleAction = async (id: string, status: BookingStatus) => {
    setLoading(id)
    try {
      await updateBookingStatus(id, status)
      toast.success('Status updated')
      router.refresh()
    } catch { toast.error('Update failed') }
    finally { setLoading(null); setOpen(null) }
  }

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-gray-900 mb-6">Bookings</h1>

      <div className="flex gap-2 mb-5 flex-wrap">
        {FILTERS.map((f) => (
          <a key={f.key} href={f.key ? `/admin/bookings?filter=${f.key}` : '/admin/bookings'}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${filter === f.key || (!filter && !f.key) ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-300 hover:border-primary'}`}>
            {f.label}
          </a>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>{['Reference', 'Guest', 'Room', 'Check-in', 'Check-out', 'Amount', 'Booking', 'Payment', 'Actions'].map((h) => <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs text-primary">{b.bookingReference}</td>
                <td className="px-4 py-3"><p className="font-medium">{b.guestName}</p><p className="text-gray-400 text-xs">{b.guestEmail}</p></td>
                <td className="px-4 py-3 text-gray-700">{b.room?.name}</td>
                <td className="px-4 py-3 text-gray-600">{formatDate(b.checkIn)}</td>
                <td className="px-4 py-3 text-gray-600">{formatDate(b.checkOut)}</td>
                <td className="px-4 py-3 font-medium">{formatCurrency(b.totalAmount)}</td>
                <td className="px-4 py-3"><BookingBadge status={b.bookingStatus} /></td>
                <td className="px-4 py-3"><PaymentBadge status={b.paymentStatus} /></td>
                <td className="px-4 py-3 relative">
                  <button onClick={() => setOpen(open === b.id ? null : b.id)} disabled={loading === b.id}
                    className="text-xs border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50">
                    {loading === b.id ? '...' : 'Actions'}
                  </button>
                  {open === b.id && (
                    <div className="absolute right-4 top-10 bg-white border rounded-xl shadow-lg z-10 py-1 min-w-36">
                      {ACTIONS.map((a) => (
                        <button key={a.status} onClick={() => handleAction(b.id, a.status)}
                          className={`w-full text-left px-4 py-2 text-xs font-medium ${a.cls}`}>
                          {a.label}
                        </button>
                      ))}
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {!bookings.length && <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-400">No bookings found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
