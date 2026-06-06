import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { confirmPayment } from '@/features/payments/actions'
import { prisma } from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id')
  if (!sessionId) return NextResponse.redirect(new URL('/rooms', req.url))

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status === 'paid') {
      const bookingId = session.metadata?.bookingId
      if (bookingId) {
        const amount = (session.amount_total ?? 0) / 100
        await confirmPayment(bookingId, session.id, amount, 'stripe')
        const booking = await prisma.booking.findUnique({ where: { id: bookingId } })
        if (booking) {
          return NextResponse.redirect(
            new URL(`/booking/confirmation?ref=${booking.bookingReference}`, req.url)
          )
        }
      }
    }
  } catch {
    // fall through to redirect /rooms on any error
  }

  return NextResponse.redirect(new URL('/rooms', req.url))
}
