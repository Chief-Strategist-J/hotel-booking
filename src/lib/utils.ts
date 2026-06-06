import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, differenceInDays } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | string | { toString(): string }) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(Number(amount))
}

export function formatDate(date: Date | string) {
  return format(new Date(date), 'MMM dd, yyyy')
}

export function calculateNights(checkIn: Date | string, checkOut: Date | string) {
  return differenceInDays(new Date(checkOut), new Date(checkIn))
}

export function generateRef() {
  const id = crypto.randomUUID().replace(/-/g, '').slice(0, 12).toUpperCase()
  return `HTL-${id.slice(0, 6)}-${id.slice(6)}`
}

/** Strip Prisma Decimal / Date objects so values are safe to pass to Client Components */
export function serialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data))
}
