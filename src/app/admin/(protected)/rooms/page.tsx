import { getRooms } from '@/features/rooms/actions'
import { RoomsClient } from './_components/RoomsClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Manage Rooms' }

export default async function AdminRoomsPage() {
  const rooms = await getRooms()
  return <RoomsClient rooms={rooms as any} />
}
