import { getPayments } from '@/features/payments/actions'
import { PaymentBadge } from '@/features/bookings/BookingBadges'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Payments' }

export default async function AdminPaymentsPage() {
  const payments = await getPayments()
  const totalRevenue = payments.filter((p) => p.status === 'PAID').reduce((s, p) => s + Number(p.amount), 0)
  const pending = payments.filter((p) => p.status === 'UNPAID').length
  const refunded = payments.filter((p) => p.status === 'REFUNDED').length

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-gray-900 mb-6">Payments</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Revenue', value: formatCurrency(totalRevenue), cls: 'text-green-600 bg-green-50' },
          { label: 'Pending', value: String(pending), cls: 'text-amber-600 bg-amber-50' },
          { label: 'Refunded', value: String(refunded), cls: 'text-gray-600 bg-gray-50' },
        ].map(({ label, value, cls }) => (
          <div key={label} className="bg-white rounded-xl p-5 shadow-sm border">
            <p className={`text-2xl font-bold ${cls.split(' ')[0]}`}>{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>{['Booking Ref', 'Guest', 'Amount', 'Method', 'Gateway', 'Status', 'Paid At'].map((h) => <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {payments.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs text-primary">{p.booking.bookingReference}</td>
                <td className="px-4 py-3"><p className="font-medium">{p.booking.guestName}</p><p className="text-gray-400 text-xs">{p.booking.guestEmail}</p></td>
                <td className="px-4 py-3 font-medium">{formatCurrency(p.amount)}</td>
                <td className="px-4 py-3 text-gray-600">{p.booking.paymentMethod === 'ONLINE' ? 'Online' : 'At Hotel'}</td>
                <td className="px-4 py-3 text-gray-600 capitalize">{p.gateway}</td>
                <td className="px-4 py-3"><PaymentBadge status={p.status as any} /></td>
                <td className="px-4 py-3 text-gray-500">{p.paidAt ? formatDate(p.paidAt) : '—'}</td>
              </tr>
            ))}
            {!payments.length && <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No payments yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
