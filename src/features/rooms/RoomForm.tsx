'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { createRoom, updateRoom } from './actions'
import type { Room, RoomFormData } from './types'

const TYPES = ['STANDARD', 'DELUXE', 'SUITE', 'EXECUTIVE', 'PENTHOUSE'] as const
const AMENITIES = ['Free WiFi', 'Air Conditioning', 'TV', 'Mini Bar', 'Room Service', 'Jacuzzi', 'Balcony', 'Safe', 'Bathrobe', 'Coffee Maker', 'Parking', 'Gym']

export function RoomForm({ room, onSuccess }: { room?: Room; onSuccess?: () => void }) {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<RoomFormData>({
    defaultValues: room ? { ...room, price: Number(room.price) } : { type: 'STANDARD', status: 'AVAILABLE', amenities: [] },
  })
  const selected = watch('amenities') || []

  const toggle = (a: string) => setValue('amenities', selected.includes(a) ? selected.filter((x) => x !== a) : [...selected, a])

  const onSubmit = async (data: RoomFormData) => {
    setLoading(true)
    try {
      if (room) { await updateRoom(room.id, data); toast.success('Room updated') }
      else { await createRoom(data); toast.success('Room created') }
      onSuccess?.()
    } catch { toast.error('Something went wrong') }
    finally { setLoading(false) }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Room Name</label>
        <input {...register('name', { required: 'Required' })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select {...register('type')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
            {TYPES.map((t) => <option key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase()}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select {...register('status')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="AVAILABLE">Available</option>
            <option value="UNAVAILABLE">Unavailable</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price / Night (&#8358;)</label>
          <input type="number" {...register('price', { valueAsNumber: true, required: 'Required', min: 1 })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
          <input type="number" {...register('capacity', { valueAsNumber: true, required: 'Required', min: 1 })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea rows={3} {...register('description', { required: 'Required' })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
        <div className="flex flex-wrap gap-2">
          {AMENITIES.map((a) => (
            <button key={a} type="button" onClick={() => toggle(a)}
              className={`px-3 py-1 rounded-full text-xs border transition-colors ${selected.includes(a) ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-300 hover:border-primary'}`}>
              {a}
            </button>
          ))}
        </div>
      </div>
      <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition-colors">
        {loading ? 'Saving...' : room ? 'Update Room' : 'Create Room'}
      </button>
    </form>
  )
}
