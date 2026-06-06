import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getRoomById } from '@/features/rooms/actions'
import { RoomGallery } from '@/features/rooms/RoomGallery'
import { AvailabilityChecker } from '@/features/rooms/AvailabilityChecker'
import { formatCurrency } from '@/lib/utils'
import { Users, CheckCircle, ArrowLeft, Star, ShieldCheck } from 'lucide-react'

interface Props { params: { id: string }; searchParams: { checkIn?: string; checkOut?: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const room = await getRoomById(params.id)
  if (!room) return { title: 'Room Not Found' }
  const primary = room.images.find((i) => i.isPrimary) || room.images[0]
  return {
    title: `${room.name} — ${formatCurrency(room.price)}/night`,
    description: room.description,
    openGraph: {
      title: `${room.name} | GrandStay Hotel`,
      description: room.description,
      ...(primary && { images: [{ url: primary.imageUrl, width: 800, height: 600, alt: room.name }] }),
    },
  }
}

export default async function RoomDetailPage({ params, searchParams }: Props) {
  const room = await getRoomById(params.id)
  if (!room) notFound()

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      {/* Breadcrumb / Back */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-7">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <Link href="/rooms" className="hover:text-primary transition-colors">Rooms</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate max-w-[180px]">{room.name}</span>
      </nav>

      <div className="grid md:grid-cols-3 gap-8 md:gap-10">
        {/* ── Booking card — shown first on mobile ── */}
        <div className="md:col-span-1 md:order-2">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_20px_60px_-10px_rgba(26,60,94,.18)] md:sticky md:top-[84px] overflow-hidden">
            {/* Price header */}
            <div className="bg-primary px-6 py-5">
              <p className="text-blue-300 text-xs uppercase tracking-wider mb-1">From</p>
              <p className="text-4xl font-bold text-white font-serif">{formatCurrency(room.price)}</p>
              <p className="text-blue-300 text-sm mt-0.5">per night · taxes included</p>
            </div>

            <div className="p-5">
              <AvailabilityChecker
                roomId={room.id}
                defaultCheckIn={searchParams.checkIn}
                defaultCheckOut={searchParams.checkOut}
              />
              <div className="mt-4 space-y-2">
                {[
                  { icon: ShieldCheck, text: 'Free cancellation available' },
                  { icon: Star, text: 'Best rate guaranteed' },
                ].map(({ icon: Icon, text }) => (
                  <p key={text} className="flex items-center gap-2 text-xs text-gray-500">
                    <Icon className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Room details ── */}
        <div className="md:col-span-2 md:order-1">
          <RoomGallery images={room.images as any} name={room.name} />

          <div className="mt-8">
            {/* Title row */}
            <div className="flex flex-wrap items-start gap-3 mb-3">
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-primary flex-1 leading-snug min-w-0">
                {room.name}
              </h1>
              <span className="bg-primary-50 text-primary text-xs font-semibold px-3 py-1.5 rounded-full shrink-0">
                {room.type.charAt(0) + room.type.slice(1).toLowerCase()}
              </span>
            </div>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-gray-400" />
                Up to {room.capacity} guests
              </span>
              <span className="flex items-center gap-1.5 text-gold font-medium">
                <Star className="h-4 w-4 fill-gold text-gold" />
                4.9 Excellent
              </span>
            </div>

            <p className="text-gray-600 leading-relaxed text-base mb-8">{room.description}</p>

            {room.amenities.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Room Amenities</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {room.amenities.map((a) => (
                    <div key={a} className="flex items-center gap-2.5 text-sm text-gray-700 bg-gray-50 rounded-xl px-4 py-2.5">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      {a}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-100">
              <Link
                href="/rooms"
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Back to all rooms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
