'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Eye, EyeOff, CheckCircle } from 'lucide-react'
import { saveSettings } from '@/features/settings/actions'

type FormData = { stripe_secret_key: string; stripe_publishable_key: string }

export function SettingsClient({ saved }: { saved: Record<string, string> }) {
  const [showSecret, setShowSecret] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      stripe_secret_key: saved.stripe_secret_key || '',
      stripe_publishable_key: saved.stripe_publishable_key || '',
    },
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      // Only save non-empty values; skip masked placeholders
      const entries: Record<string, string> = {}
      if (data.stripe_secret_key && !data.stripe_secret_key.startsWith('sk_...')) {
        entries.stripe_secret_key = data.stripe_secret_key.trim()
      }
      if (data.stripe_publishable_key && !data.stripe_publishable_key.startsWith('pk_...')) {
        entries.stripe_publishable_key = data.stripe_publishable_key.trim()
      }
      if (Object.keys(entries).length > 0) {
        await saveSettings(entries)
        toast.success('Settings saved')
      } else {
        toast('No changes to save')
      }
    } catch {
      toast.error('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  const isActive = !!saved.stripe_secret_key

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      {/* Stripe */}
      <div className="bg-white rounded-xl border shadow-sm">
        <div className="p-5 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Stripe wordmark */}
            <div className="w-10 h-10 bg-[#635bff] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm tracking-tight">S</span>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Stripe Payments</h2>
              <p className="text-xs text-gray-500">Accept card payments via Stripe Checkout</p>
            </div>
          </div>
          <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
            {isActive && <CheckCircle className="h-3.5 w-3.5" />}
            {isActive ? 'Connected' : 'Not configured'}
          </span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Secret Key <span className="text-gray-400 font-normal">(sk_live_... or sk_test_...)</span>
            </label>
            <div className="relative">
              <input
                type={showSecret ? 'text' : 'password'}
                placeholder={saved.stripe_secret_key ? '••••••••••••••••' : 'sk_test_...'}
                {...register('stripe_secret_key')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono"
              />
              <button type="button" onClick={() => setShowSecret(!showSecret)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Publishable Key <span className="text-gray-400 font-normal">(pk_live_... or pk_test_...)</span>
            </label>
            <input
              type="text"
              placeholder={saved.stripe_publishable_key ? '••••••••••••••••' : 'pk_test_...'}
              {...register('stripe_publishable_key')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono"
            />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-xs text-amber-800 space-y-1">
            <p className="font-semibold">Where to find your keys</p>
            <p>Log in to <strong>dashboard.stripe.com</strong> → Developers → API keys.</p>
            <p>Use <strong>test keys</strong> (sk_test_ / pk_test_) during development, <strong>live keys</strong> for production.</p>
          </div>

          <button type="submit" disabled={loading}
            className="bg-primary hover:bg-primary/90 disabled:opacity-60 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors">
            {loading ? 'Saving...' : 'Save Keys'}
          </button>
        </form>
      </div>
    </div>
  )
}
