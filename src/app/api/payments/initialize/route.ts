import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { bookingId, email, amount } = await req.json()
  const res = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      amount: Math.round(Number(amount) * 100),
      metadata: { bookingId },
      callback_url: `${process.env.NEXTAUTH_URL}/api/payments/verify`,
    }),
  })
  const data = await res.json()
  if (!data.status) return NextResponse.json({ error: data.message }, { status: 400 })
  return NextResponse.json(data.data)
}
