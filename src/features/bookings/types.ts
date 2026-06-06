export type BookingStatus = 'PENDING' | 'RESERVED' | 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED' | 'NO_SHOW'
export type PaymentStatus = 'UNPAID' | 'PAID' | 'REFUNDED'
export type PaymentMethod = 'ONLINE' | 'PAY_AT_HOTEL'

export interface Booking {
  id: string; bookingReference: string; guestName: string; guestEmail: string; guestPhone: string
  roomId: string; checkIn: Date; checkOut: Date; guests: number; totalAmount: string | number
  bookingStatus: BookingStatus; paymentStatus: PaymentStatus; paymentMethod: PaymentMethod
  specialRequests?: string | null; createdAt: Date
  room?: { id: string; name: string; type: string; images: { imageUrl: string; isPrimary: boolean }[] }
  payment?: { transactionReference?: string | null; paidAt?: Date | null } | null
}

export interface BookingFormData {
  guestName: string; guestEmail: string; guestPhone: string
  roomId: string; checkIn: string; checkOut: string; guests: number
  paymentMethod: PaymentMethod; specialRequests?: string
}
