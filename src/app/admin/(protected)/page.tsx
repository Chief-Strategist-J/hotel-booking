import { BedDouble, CheckSquare, CalendarCheck, CreditCard, Clock } from 'lucide-react'
import { getDashboardStats, getBookings } from '@/features/bookings/actions'
import { BookingBadge, PaymentBadge } from '@/features/bookings/BookingBadges'
import { formatDate, formatCurrency } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function AdminDashboard() {
  const [stats, bookings] = await Promise.all([getDashboardStats(), getBookings()])
  const recent = bookings.slice(0, 5)

  const cards = [
    { label: 'Total Rooms', value: stats.totalRooms, icon: BedDouble, color: 'text-blue-600 bg-blue-50' },
    { label: 'Available', value: stats.availableRooms, icon: CheckSquare, color: 'text-green-600 bg-green-50' },
    { label: 'Active Bookings', value: stats.activeBookings, icon: CalendarCheck, color: 'text-purple-600 bg-purple-50' },
    { label: 'Pending Payments', value: stats.pendingPayments, icon: CreditCard, color: 'text-amber-600 bg-amber-50' },
    { label: 'Check-ins (7d)', value: stats.upcomingCheckIns, icon: Clock, color: 'text-primary bg-blue-50' },
  ]

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl p-5 shadow-sm border">
            <div className={`inline-flex p-2 rounded-lg ${color} mb-3`}><Icon className="h-5 w-5" /></div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-5 border-b"><h2 className="font-semibold text-gray-900">Recent Bookings</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>{['Reference', 'Guest', 'Room', 'Check-in', 'Check-out', 'Amount', 'Status', 'Payment'].map((h) => <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recent.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-primary">{b.bookingReference}</td>
                  <td className="px-4 py-3"><p className="font-medium">{b.guestName}</p><p className="text-gray-400 text-xs">{b.guestEmail}</p></td>
                  <td className="px-4 py-3 text-gray-700">{b.room?.name}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(b.checkIn)}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(b.checkOut)}</td>
                  <td className="px-4 py-3 font-medium">{formatCurrency(b.totalAmount)}</td>
                  <td className="px-4 py-3"><BookingBadge status={b.bookingStatus as any} /></td>
                  <td className="px-4 py-3"><PaymentBadge status={b.paymentStatus as any} /></td>
                </tr>
              ))}
              {!recent.length && <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">No bookings yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
