import nodemailer from 'nodemailer'
import { formatDate, formatCurrency } from '@/lib/utils'

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
})

function row(label: string, value: string) {
  return `<tr><td style="padding:6px 0;color:#6b7280;font-size:14px">${label}</td><td style="padding:6px 0;font-size:14px;font-weight:600">${value}</td></tr>`
}

function template(title: string, body: string) {
  return `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto">
    <div style="background:#1a3c5e;padding:20px;text-align:center"><h2 style="color:#fff;margin:0">GrandStay Hotel</h2></div>
    <div style="padding:28px;background:#f9fafb"><h3 style="color:#1a3c5e;margin-top:0">${title}</h3>${body}</div>
    <div style="background:#1a3c5e;padding:12px;text-align:center"><p style="color:#93c5fd;font-size:12px;margin:0">&copy; GrandStay Hotel</p></div>
  </div>`
}

export async function sendConfirmationEmail(booking: any) {
  const html = template('Booking Confirmation', `
    <p>Dear ${booking.guestName},</p>
    <p>Your booking is confirmed. Here are your details:</p>
    <table style="width:100%">
      ${row('Reference', booking.bookingReference)}
      ${row('Room', booking.room?.name || '-')}
      ${row('Check-in', formatDate(booking.checkIn))}
      ${row('Check-out', formatDate(booking.checkOut))}
      ${row('Total', formatCurrency(booking.totalAmount))}
      ${row('Payment', booking.paymentMethod === 'ONLINE' ? 'Online Payment' : 'Pay at Hotel')}
      ${row('Status', booking.bookingStatus)}
    </table>
  `)
  await transport.sendMail({ from: process.env.EMAIL_FROM, to: booking.guestEmail, subject: `Booking Confirmed – ${booking.bookingReference}`, html })
}

export async function sendAdminEmail(booking: any) {
  const html = template('New Booking Received', `
    <table style="width:100%">
      ${row('Guest', `${booking.guestName} (${booking.guestEmail})`)}
      ${row('Reference', booking.bookingReference)}
      ${row('Room', booking.room?.name || '-')}
      ${row('Check-in', formatDate(booking.checkIn))}
      ${row('Check-out', formatDate(booking.checkOut))}
      ${row('Total', formatCurrency(booking.totalAmount))}
      ${row('Payment', booking.paymentMethod === 'ONLINE' ? 'Online' : 'Pay at Hotel')}
    </table>
  `)
  await transport.sendMail({ from: process.env.EMAIL_FROM, to: process.env.ADMIN_EMAIL, subject: `New Booking: ${booking.bookingReference}`, html })
}
