'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getPayments() {
  return prisma.payment.findMany({
    include: { booking: true },
    orderBy: { createdAt: 'desc' },
  })
}

export async function confirmPayment(bookingId: string, transactionRef: string, amount: number) {
  await prisma.$transaction([
    prisma.payment.upsert({
      where: { bookingId },
      update: { status: 'PAID', transactionReference: transactionRef, paidAt: new Date() },
      create: { bookingId, amount, gateway: 'paystack', transactionReference: transactionRef, status: 'PAID', paidAt: new Date() },
    }),
    prisma.booking.update({ where: { id: bookingId }, data: { paymentStatus: 'PAID', bookingStatus: 'CONFIRMED' } }),
  ])
  revalidatePath('/admin/payments')
  revalidatePath('/admin/bookings')
}
