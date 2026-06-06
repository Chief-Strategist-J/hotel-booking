export type RoomType = 'STANDARD' | 'DELUXE' | 'SUITE' | 'EXECUTIVE' | 'PENTHOUSE'
export type RoomStatus = 'AVAILABLE' | 'UNAVAILABLE'

export interface RoomImage { id: string; roomId: string; imageUrl: string; isPrimary: boolean }

export interface Room {
  id: string; name: string; type: RoomType; description: string
  price: string | number; capacity: number; amenities: string[]
  status: RoomStatus; images: RoomImage[]
}

export interface RoomFormData {
  name: string; type: RoomType; description: string
  price: number; capacity: number; amenities: string[]; status: RoomStatus
}
