import type { BookingStatus, PaymentStatus } from './types'

const bsCfg: Record<BookingStatus, { label: string; cls: string }> = {
  PENDING:     { label: 'Pending',     cls: 'bg-yellow-100 text-yellow-800' },
  RESERVED:    { label: 'Reserved',    cls: 'bg-blue-100 text-blue-800' },
  CONFIRMED:   { label: 'Confirmed',   cls: 'bg-green-100 text-green-800' },
  CHECKED_IN:  { label: 'Checked In',  cls: 'bg-teal-100 text-teal-800' },
  CHECKED_OUT: { label: 'Checked Out', cls: 'bg-gray-100 text-gray-800' },
  CANCELLED:   { label: 'Cancelled',   cls: 'bg-red-100 text-red-800' },
  NO_SHOW:     { label: 'No Show',     cls: 'bg-red-100 text-red-800' },
}

const psCfg: Record<PaymentStatus, { label: string; cls: string }> = {
  UNPAID:   { label: 'Unpaid',   cls: 'bg-yellow-100 text-yellow-800' },
  PAID:     { label: 'Paid',     cls: 'bg-green-100 text-green-800' },
  REFUNDED: { label: 'Refunded', cls: 'bg-gray-100 text-gray-800' },
}

export function BookingBadge({ status }: { status: BookingStatus }) {
  const { label, cls } = bsCfg[status]
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>{label}</span>
}

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  const { label, cls } = psCfg[status]
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>{label}</span>
}
