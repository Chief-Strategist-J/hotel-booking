import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const { bookingId, email, amount, roomName } = await req.json()

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'ngn',
            product_data: {
              name: roomName ? `GrandStay Hotel — ${roomName}` : 'GrandStay Hotel Booking',
              description: 'Room reservation',
            },
            unit_amount: Math.round(Number(amount) * 100), // kobo
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/api/payments/verify?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/rooms`,
      metadata: { bookingId },
    })

    return NextResponse.json({ authorization_url: session.url })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}
