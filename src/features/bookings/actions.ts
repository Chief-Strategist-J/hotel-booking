'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { generateRef, serialize } from '@/lib/utils'
import { sendConfirmationEmail, sendAdminEmail } from '@/features/email/mailer'
import type { BookingFormData, BookingStatus } from './types'

export async function createBooking(data: BookingFormData) {
  const room = await prisma.room.findUnique({ where: { id: data.roomId } })
  if (!room) throw new Error('Room not found')
  const nights = Math.ceil((new Date(data.checkOut).getTime() - new Date(data.checkIn).getTime()) / 86400000)
  const totalAmount = Number(room.price) * nights

  const booking = await prisma.booking.create({
    data: {
      bookingReference: generateRef(),
      guestName: data.guestName,
      guestEmail: data.guestEmail,
      guestPhone: data.guestPhone,
      roomId: data.roomId,
      checkIn: new Date(data.checkIn),
      checkOut: new Date(data.checkOut),
      guests: data.guests,
      totalAmount,
      paymentMethod: data.paymentMethod,
      bookingStatus: data.paymentMethod === 'PAY_AT_HOTEL' ? 'RESERVED' : 'PENDING',
      paymentStatus: 'UNPAID',
      specialRequests: data.specialRequests,
    },
    include: { room: { include: { images: true } } },
  })

  await Promise.all([sendConfirmationEmail(booking), sendAdminEmail(booking)]).catch(console.error)
  revalidatePath('/admin/bookings')
  return serialize(booking)
}

export async function getBookings(filter?: string) {
  const statusMap: Record<string, string[]> = {
    upcoming: ['RESERVED', 'CONFIRMED'],
    active: ['CHECKED_IN'],
    completed: ['CHECKED_OUT'],
    cancelled: ['CANCELLED', 'NO_SHOW'],
  }
  const statuses = filter ? statusMap[filter] : undefined
  const bookings = await prisma.booking.findMany({
    where: statuses ? { bookingStatus: { in: statuses as any } } : undefined,
    include: { room: { include: { images: true } }, payment: true },
    orderBy: { createdAt: 'desc' },
  })
  return serialize(bookings)
}

export async function getBookingByRef(ref: string) {
  const booking = await prisma.booking.findUnique({
    where: { bookingReference: ref },
    include: { room: { include: { images: true } }, payment: true },
  })
  return booking ? serialize(booking) : null
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  const booking = await prisma.booking.update({ where: { id }, data: { bookingStatus: status } })
  revalidatePath('/admin/bookings')
  return serialize(booking)
}

export async function getDashboardStats() {
  const now = new Date()
  const weekLater = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7)
  const [totalRooms, availableRooms, activeBookings, pendingPayments, upcomingCheckIns] = await Promise.all([
    prisma.room.count(),
    prisma.room.count({ where: { status: 'AVAILABLE' } }),
    prisma.booking.count({ where: { bookingStatus: { in: ['CONFIRMED', 'CHECKED_IN'] } } }),
    prisma.booking.count({ where: { paymentStatus: 'UNPAID', bookingStatus: { notIn: ['CANCELLED', 'NO_SHOW'] } } }),
    prisma.booking.count({ where: { bookingStatus: 'CONFIRMED', checkIn: { gte: now, lt: weekLater } } }),
  ])
  return { totalRooms, availableRooms, activeBookings, pendingPayments, upcomingCheckIns }
}
