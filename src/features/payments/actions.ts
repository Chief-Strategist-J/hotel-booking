'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { serialize } from '@/lib/utils'

export async function getPayments() {
  const payments = await prisma.payment.findMany({
    include: { booking: true },
    orderBy: { createdAt: 'desc' },
  })
  return serialize(payments)
}

export async function confirmPayment(
  bookingId: string,
  transactionRef: string,
  amount: number,
  gateway: string = 'stripe'
) {
  await prisma.$transaction([
    prisma.payment.upsert({
      where: { bookingId },
      update: { status: 'PAID', transactionReference: transactionRef, paidAt: new Date() },
      create: { bookingId, amount, gateway, transactionReference: transactionRef, status: 'PAID', paidAt: new Date() },
    }),
    prisma.booking.update({
      where: { id: bookingId },
      data: { paymentStatus: 'PAID', bookingStatus: 'CONFIRMED' },
    }),
  ])
  revalidatePath('/admin/payments')
  revalidatePath('/admin/bookings')
}
