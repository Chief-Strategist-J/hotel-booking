# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev           # Start dev server on localhost:3000
npm run build         # Production build
npm run db:push       # Push schema to DB without migration (dev)
npm run db:migrate    # Create and run a named migration
npm run db:studio     # Open Prisma Studio
npm run db:seed       # Seed DB with admin user + sample rooms
```

## Setup

1. Copy `.env.example` to `.env` and fill all values
2. Run `npm install`
3. Run `npm run db:push` then `npm run db:seed`
4. Run `npm run dev`

Seed credentials: `admin@hotel.com` / `admin123`

## Architecture

Next.js 14 App Router. Feature folder structure — all logic for a domain lives under `src/features/<domain>/`.

**Routes:**
- `src/app/(public)/` — guest site with Navbar + Footer layout
- `src/app/admin/` — protected dashboard (NextAuth session guard in layout)
- `src/app/api/` — auth, image upload, Paystack payment

**Features (`src/features/`):**
- `rooms/` — `actions.ts` (server actions), `types.ts`, `RoomCard`, `RoomGallery`, `AvailabilityChecker`, `RoomForm`
- `bookings/` — `actions.ts`, `types.ts`, `BookingForm`, `BookingBadges`
- `payments/` — `actions.ts` (confirmPayment)
- `email/` — `mailer.ts` (guest confirmation + admin notification via Nodemailer)

**Shared:**
- `src/lib/prisma.ts` — singleton Prisma client
- `src/lib/auth.ts` — NextAuth CredentialsProvider against `admins` table
- `src/lib/storage.ts` — S3/R2 image upload
- `src/lib/utils.ts` — `cn`, `formatCurrency`, `formatDate`, `calculateNights`, `generateRef`
- `src/components/` — `Navbar`, `Footer`, `AdminSidebar`, `SessionProvider`

## Booking Flow

**Online:** `BookingForm` -> `createBooking` (status=PENDING) -> POST `/api/payments/initialize` -> Paystack -> GET `/api/payments/verify` -> `confirmPayment` (CONFIRMED + PAID) -> confirmation page

**Pay at Hotel:** `createBooking` (status=RESERVED, paymentStatus=UNPAID) -> confirmation page directly

## Database

Prisma + PostgreSQL. Schema: `Admin`, `Room`, `RoomImage`, `Booking`, `Payment`. Availability checked by date overlap query excluding CANCELLED/NO_SHOW bookings.
