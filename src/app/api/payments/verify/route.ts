import { NextRequest, NextResponse } from 'next/server'
import { confirmPayment } from '@/features/payments/actions'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get('reference')
  if (!ref) return NextResponse.redirect(new URL('/rooms', req.url))

  const res = await fetch(`https://api.paystack.co/transaction/verify/${ref}`, {
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
  })
  const data = await res.json()

  if (data.data?.status === 'success') {
    const bookingId = data.data.metadata?.bookingId
    if (bookingId) {
      await confirmPayment(bookingId, ref, data.data.amount / 100)
      const booking = await prisma.booking.findUnique({ where: { id: bookingId } })
      if (booking) return NextResponse.redirect(new URL(`/booking/confirmation?ref=${booking.bookingReference}`, req.url))
    }
  }
  return NextResponse.redirect(new URL('/rooms', req.url))
}
