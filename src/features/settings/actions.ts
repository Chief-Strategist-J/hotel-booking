'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getSetting(key: string): Promise<string | null> {
  const row = await prisma.setting.findUnique({ where: { key } })
  return row?.value ?? null
}

export async function getSettings(keys: string[]): Promise<Record<string, string>> {
  const rows = await prisma.setting.findMany({ where: { key: { in: keys } } })
  return Object.fromEntries(rows.map((r) => [r.key, r.value]))
}

export async function saveSettings(entries: Record<string, string>) {
  await Promise.all(
    Object.entries(entries).map(([key, value]) =>
      prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    )
  )
  revalidatePath('/admin/settings')
}
