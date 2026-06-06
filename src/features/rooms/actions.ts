'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import type { RoomFormData } from './types'

export async function getRooms() {
  return prisma.room.findMany({ include: { images: true }, orderBy: { createdAt: 'desc' } })
}

export async function getAvailableRooms(checkIn: string, checkOut: string) {
  const blocked = await prisma.booking.findMany({
    where: {
      bookingStatus: { notIn: ['CANCELLED', 'NO_SHOW'] },
      checkIn: { lt: new Date(checkOut) },
      checkOut: { gt: new Date(checkIn) },
    },
    select: { roomId: true },
  })
  return prisma.room.findMany({
    where: { status: 'AVAILABLE', id: { notIn: blocked.map((b) => b.roomId) } },
    include: { images: true },
    orderBy: { price: 'asc' },
  })
}

export async function getRoomById(id: string) {
  return prisma.room.findUnique({ where: { id }, include: { images: true } })
}

export async function isRoomAvailable(roomId: string, checkIn: string, checkOut: string) {
  const conflict = await prisma.booking.findFirst({
    where: {
      roomId,
      bookingStatus: { notIn: ['CANCELLED', 'NO_SHOW'] },
      checkIn: { lt: new Date(checkOut) },
      checkOut: { gt: new Date(checkIn) },
    },
  })
  return !conflict
}

export async function createRoom(data: RoomFormData) {
  const room = await prisma.room.create({ data })
  revalidatePath('/admin/rooms')
  revalidatePath('/rooms')
  return room
}

export async function updateRoom(id: string, data: Partial<RoomFormData>) {
  const room = await prisma.room.update({ where: { id }, data })
  revalidatePath('/admin/rooms')
  revalidatePath('/rooms')
  return room
}

export async function deleteRoom(id: string) {
  await prisma.room.delete({ where: { id } })
  revalidatePath('/admin/rooms')
}

export async function addRoomImage(roomId: string, imageUrl: string, isPrimary: boolean) {
  return prisma.roomImage.create({ data: { roomId, imageUrl, isPrimary } })
}

export async function deleteRoomImage(id: string) {
  return prisma.roomImage.delete({ where: { id } })
}
