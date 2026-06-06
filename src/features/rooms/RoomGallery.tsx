'use client'
import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { RoomImage } from './types'

export function RoomGallery({ images, name }: { images: RoomImage[]; name: string }) {
  const [active, setActive] = useState(0)
  if (!images.length) return <div className="h-80 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">No images</div>

  return (
    <div className="space-y-2">
      <div className="relative h-80 rounded-xl overflow-hidden">
        <Image src={images[active].imageUrl} alt={name} fill className="object-cover" />
        {images.length > 1 && (
          <>
            <button onClick={() => setActive((i) => (i - 1 + images.length) % images.length)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-1">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={() => setActive((i) => (i + 1) % images.length)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-1">
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button key={img.id} onClick={() => setActive(i)} className={`relative h-16 w-24 flex-shrink-0 rounded-lg overflow-hidden border-2 ${i === active ? 'border-amber-500' : 'border-transparent'}`}>
              <Image src={img.imageUrl} alt={name} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
