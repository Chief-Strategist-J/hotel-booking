import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { uploadImage } from '@/lib/storage'
import { addRoomImage } from '@/features/rooms/actions'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('image') as File | null
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  const buffer = Buffer.from(await file.arrayBuffer())
  const ext = file.type.split('/')[1] || 'jpg'
  const key = `rooms/${params.id}/${crypto.randomUUID()}.${ext}`
  const imageUrl = await uploadImage(buffer, file.type, key)

  const count = await prisma.roomImage.count({ where: { roomId: params.id } })
  const image = await addRoomImage(params.id, imageUrl, count === 0)
  return NextResponse.json(image)
}
