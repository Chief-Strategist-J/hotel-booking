import Image from 'next/image'
import Link from 'next/link'
import { Users, ArrowRight } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { Room } from './types'

interface Props { room: Room; checkIn?: string; checkOut?: string }

export function RoomCard({ room, checkIn, checkOut }: Props) {
  const primary = room.images.find((i) => i.isPrimary) || room.images[0]
  const query = checkIn && checkOut ? `?checkIn=${checkIn}&checkOut=${checkOut}` : ''

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,.06)] hover:shadow-[0_8px_30px_rgba(0,0,0,.12)] hover:-translate-y-1 transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {primary ? (
          <Image
            src={primary.imageUrl}
            alt={room.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
            No image
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />

        {/* Type badge — top left */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-primary text-xs font-semibold px-2.5 py-1 rounded-full">
          {room.type.charAt(0) + room.type.slice(1).toLowerCase()}
        </span>

        {/* Price — bottom right */}
        <div className="absolute bottom-3 right-3 bg-gold text-white rounded-xl px-3 py-1.5 text-right">
          <span className="text-sm font-bold block leading-none">{formatCurrency(room.price)}</span>
          <span className="text-[10px] opacity-85">per night</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-serif text-lg font-semibold text-gray-900 leading-snug line-clamp-1">{room.name}</h3>
        <p className="flex items-center gap-1.5 text-xs text-gray-500 mt-1.5 mb-4">
          <Users className="h-3.5 w-3.5 flex-shrink-0" />
          Up to {room.capacity} guests
        </p>
        <Link
          href={`/rooms/${room.id}${query}`}
          className="flex items-center justify-between w-full bg-primary-50 hover:bg-primary text-primary hover:text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 group/btn"
        >
          <span>View Details</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
        </Link>
      </div>
    </div>
  )
}
