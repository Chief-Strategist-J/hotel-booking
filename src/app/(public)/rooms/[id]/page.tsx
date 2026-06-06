import { notFound } from 'next/navigation'
import { getRoomById } from '@/features/rooms/actions'
import { RoomGallery } from '@/features/rooms/RoomGallery'
import { AvailabilityChecker } from '@/features/rooms/AvailabilityChecker'
import { formatCurrency } from '@/lib/utils'
import { Users, CheckCircle } from 'lucide-react'
import type { Metadata } from 'next'

interface Props { params: { id: string }; searchParams: { checkIn?: string; checkOut?: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const room = await getRoomById(params.id)
  return { title: room?.name || 'Room Details' }
}

export default async function RoomDetailPage({ params, searchParams }: Props) {
  const room = await getRoomById(params.id)
  if (!room) notFound()

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2">
          <RoomGallery images={room.images as any} name={room.name} />
          <div className="mt-6">
            <div className="flex items-start justify-between mb-3">
              <h1 className="font-serif text-3xl font-bold text-primary">{room.name}</h1>
              <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full mt-1">
                {room.type.charAt(0) + room.type.slice(1).toLowerCase()}
              </span>
            </div>
            <p className="flex items-center gap-2 text-gray-500 text-sm mb-4"><Users className="h-4 w-4" />Up to {room.capacity} guests</p>
            <p className="text-gray-700 leading-relaxed mb-6">{room.description}</p>
            {room.amenities.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Amenities</h3>
                <div className="grid grid-cols-2 gap-2">
                  {room.amenities.map((a) => (
                    <div key={a} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />{a}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="sticky top-20 bg-white border rounded-xl p-6 shadow-md">
            <p className="text-3xl font-bold text-primary">{formatCurrency(room.price)}</p>
            <p className="text-gray-500 text-sm mb-6">per night</p>
            <AvailabilityChecker roomId={room.id} defaultCheckIn={searchParams.checkIn} defaultCheckOut={searchParams.checkOut} />
          </div>
        </div>
      </div>
    </div>
  )
}
