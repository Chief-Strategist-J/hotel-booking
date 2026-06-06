import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('admin123', 12)
  await prisma.admin.upsert({
    where: { email: 'admin@hotel.com' },
    update: {},
    create: { name: 'Hotel Admin', email: 'admin@hotel.com', password },
  })

  const rooms = [
    { name: 'Standard Room', type: 'STANDARD' as const, description: 'A comfortable room with all essential amenities. Great for solo travellers or couples.', price: 25000, capacity: 2, amenities: ['Free WiFi', 'Air Conditioning', 'TV', 'Room Service'] },
    { name: 'Deluxe Room', type: 'DELUXE' as const, description: 'Spacious room with premium furnishings, king-size bed, and city views.', price: 45000, capacity: 2, amenities: ['Free WiFi', 'Air Conditioning', 'TV', 'Mini Bar', 'Room Service'] },
    { name: 'Executive Suite', type: 'SUITE' as const, description: 'Separate living area, premium amenities, and panoramic city views.', price: 85000, capacity: 3, amenities: ['Free WiFi', 'Air Conditioning', 'TV', 'Mini Bar', 'Jacuzzi', 'Bathrobe', 'Coffee Maker'] },
    { name: 'Family Room', type: 'EXECUTIVE' as const, description: 'Two double beds, ideal for families. All modern amenities included.', price: 65000, capacity: 4, amenities: ['Free WiFi', 'Air Conditioning', 'TV', 'Room Service', 'Safe'] },
  ]

  for (const room of rooms) {
    await prisma.room.upsert({
      where: { id: room.name.toLowerCase().replace(/\s/g, '-') },
      update: {},
      create: { id: room.name.toLowerCase().replace(/\s/g, '-'), ...room, status: 'AVAILABLE' },
    })
  }

  console.log('Seed done. Login: admin@hotel.com / admin123')
}

main().catch(console.error).finally(() => prisma.$disconnect())
