import { getSettings } from '@/features/settings/actions'
import { SettingsClient } from './_components/SettingsClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Settings' }

export default async function AdminSettingsPage() {
  const saved = await getSettings(['stripe_secret_key', 'stripe_publishable_key'])
  return <SettingsClient saved={saved} />
}
