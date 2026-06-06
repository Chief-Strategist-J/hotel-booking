import Image from 'next/image'
import Link from 'next/link'
import { Users } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { Room } from './types'

interface Props { room: Room; checkIn?: string; checkOut?: string }

export function RoomCard({ room, checkIn, checkOut }: Props) {
  const primary = room.images.find((i) => i.isPrimary) || room.images[0]
  const query = checkIn && checkOut ? `?checkIn=${checkIn}&checkOut=${checkOut}` : ''

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-52">
        {primary ? (
          <Image src={primary.imageUrl} alt={room.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">No image</div>
        )}
        <span className="absolute top-2 left-2 bg-white text-primary text-xs font-semibold px-2 py-1 rounded">
          {room.type.charAt(0) + room.type.slice(1).toLowerCase()}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-serif text-lg font-semibold text-gray-900">{room.name}</h3>
        <p className="flex items-center gap-1 text-sm text-gray-500 mt-1">
          <Users className="h-3.5 w-3.5" /> Up to {room.capacity} guests
        </p>
        <div className="flex items-end justify-between mt-3">
          <div>
            <span className="text-xl font-bold text-primary">{formatCurrency(room.price)}</span>
            <span className="text-gray-400 text-sm"> / night</span>
          </div>
          <Link href={`/rooms/${room.id}${query}`} className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}
