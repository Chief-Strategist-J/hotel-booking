import { getBookings } from '@/features/bookings/actions'
import { BookingsClient } from './_components/BookingsClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Manage Bookings' }

export default async function AdminBookingsPage({ searchParams }: { searchParams: { filter?: string } }) {
  const bookings = await getBookings(searchParams.filter)
  return <BookingsClient bookings={bookings as any} filter={searchParams.filter} />
}
