import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const BASE = 'https://images.unsplash.com'

const rooms = [
  {
    id: 'standard-room',
    name: 'Standard Room',
    type: 'STANDARD' as const,
    description: 'A comfortable room with all essential amenities. Great for solo travellers or couples.',
    price: 25000,
    capacity: 2,
    amenities: ['Free WiFi', 'Air Conditioning', 'TV', 'Room Service'],
    images: [
      { url: `${BASE}/photo-1631049307264-da0ec9d70304?w=800&auto=format&fit=crop&q=80`, isPrimary: true },
      { url: `${BASE}/photo-1631049421450-348ccd7f8949?w=800&auto=format&fit=crop&q=80`, isPrimary: false },
    ],
  },
  {
    id: 'deluxe-room',
    name: 'Deluxe Room',
    type: 'DELUXE' as const,
    description: 'Spacious room with premium furnishings, king-size bed, and city views.',
    price: 45000,
    capacity: 2,
    amenities: ['Free WiFi', 'Air Conditioning', 'TV', 'Mini Bar', 'Room Service'],
    images: [
      { url: `${BASE}/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80`, isPrimary: true },
      { url: `${BASE}/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80`, isPrimary: false },
      { url: `${BASE}/photo-1560185007-cde436f6a4d0?w=800&auto=format&fit=crop&q=80`, isPrimary: false },
    ],
  },
  {
    id: 'executive-suite',
    name: 'Executive Suite',
    type: 'SUITE' as const,
    description: 'Separate living area, premium amenities, and panoramic city views.',
    price: 85000,
    capacity: 3,
    amenities: ['Free WiFi', 'Air Conditioning', 'TV', 'Mini Bar', 'Jacuzzi', 'Bathrobe', 'Coffee Maker'],
    images: [
      { url: `${BASE}/photo-1578683010236-d716f9a3f461?w=800&auto=format&fit=crop&q=80`, isPrimary: true },
      { url: `${BASE}/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80`, isPrimary: false },
      { url: `${BASE}/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop&q=80`, isPrimary: false },
    ],
  },
  {
    id: 'family-room',
    name: 'Family Room',
    type: 'EXECUTIVE' as const,
    description: 'Two double beds, ideal for families. All modern amenities included.',
    price: 65000,
    capacity: 4,
    amenities: ['Free WiFi', 'Air Conditioning', 'TV', 'Room Service', 'Safe'],
    images: [
      { url: `${BASE}/photo-1611892440504-42a792e24d32?w=800&auto=format&fit=crop&q=80`, isPrimary: true },
      { url: `${BASE}/photo-1583845112203-29329902332e?w=800&auto=format&fit=crop&q=80`, isPrimary: false },
    ],
  },
  {
    id: 'penthouse-suite',
    name: 'Penthouse Suite',
    type: 'PENTHOUSE' as const,
    description: 'The ultimate luxury experience. Top-floor suite with private terrace, butler service, and breathtaking Lagos skyline views.',
    price: 150000,
    capacity: 2,
    amenities: ['Free WiFi', 'Air Conditioning', 'Smart TV', 'Full Bar', 'Jacuzzi', 'Private Terrace', 'Butler Service', 'Coffee Maker', 'Bathrobe', 'Safe'],
    images: [
      { url: `${BASE}/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop&q=80`, isPrimary: true },
      { url: `${BASE}/photo-1614649024145-b3de6c4c6c2a?w=800&auto=format&fit=crop&q=80`, isPrimary: false },
      { url: `${BASE}/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80`, isPrimary: false },
    ],
  },
]

async function main() {
  // Admin
  const password = await bcrypt.hash('admin123', 12)
  await prisma.admin.upsert({
    where: { email: 'admin@hotel.com' },
    update: {},
    create: { name: 'Hotel Admin', email: 'admin@hotel.com', password },
  })

  // Rooms + images
  for (const { images, ...room } of rooms) {
    await prisma.room.upsert({
      where: { id: room.id },
      update: { ...room },
      create: { ...room, status: 'AVAILABLE' },
    })

    // Replace images every seed run so URL changes are picked up
    const existing = await prisma.roomImage.count({ where: { roomId: room.id } })
    if (existing === 0) {
      await prisma.roomImage.createMany({
        data: images.map((img) => ({ roomId: room.id, imageUrl: img.url, isPrimary: img.isPrimary })),
      })
    }
  }

  console.log('✅ Seed done.  Login: admin@hotel.com / admin123')
}

main().catch(console.error).finally(() => prisma.$disconnect())
