'use client'
import { useState } from 'react'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, Upload, X } from 'lucide-react'
import { RoomForm } from '@/features/rooms/RoomForm'
import { deleteRoom } from '@/features/rooms/actions'
import { formatCurrency } from '@/lib/utils'
import type { Room } from '@/features/rooms/types'

export function RoomsClient({ rooms: initial }: { rooms: Room[] }) {
  const [rooms, setRooms] = useState(initial)
  const [modal, setModal] = useState<{ open: boolean; room?: Room }>({ open: false })
  const [uploading, setUploading] = useState<string | null>(null)

  const refresh = () => window.location.reload()

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this room?')) return
    await deleteRoom(id)
    toast.success('Room deleted')
    setRooms((r) => r.filter((x) => x.id !== id))
  }

  const handleImageUpload = async (roomId: string, file: File) => {
    setUploading(roomId)
    const fd = new FormData()
    fd.append('image', file)
    await fetch(`/api/rooms/${roomId}/images`, { method: 'POST', body: fd })
    toast.success('Image uploaded')
    setUploading(null)
    refresh()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-bold text-gray-900">Rooms</h1>
        <button onClick={() => setModal({ open: true })} className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          <Plus className="h-4 w-4" />Add Room
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>{['Image', 'Name', 'Type', 'Capacity', 'Price/Night', 'Status', 'Actions'].map((h) => <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rooms.map((room) => {
              const img = room.images?.find((i) => i.isPrimary) || room.images?.[0]
              return (
                <tr key={room.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-gray-100">
                      {img ? <Image src={img.imageUrl} alt={room.name} fill className="object-cover" /> : (
                        <label className="w-full h-full flex items-center justify-center cursor-pointer" title="Upload image">
                          <Upload className="h-4 w-4 text-gray-400" />
                          <input type="file" accept="image/*" className="sr-only" disabled={uploading === room.id}
                            onChange={(e) => e.target.files?.[0] && handleImageUpload(room.id, e.target.files[0])} />
                        </label>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{room.name}</td>
                  <td className="px-4 py-3 text-gray-600">{room.type.charAt(0) + room.type.slice(1).toLowerCase()}</td>
                  <td className="px-4 py-3 text-gray-600">{room.capacity}</td>
                  <td className="px-4 py-3 font-medium">{formatCurrency(room.price)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${room.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{room.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <label className="p-1.5 text-gray-500 hover:text-primary hover:bg-gray-100 rounded cursor-pointer" title="Upload image">
                        <Upload className="h-4 w-4" />
                        <input type="file" accept="image/*" className="sr-only" disabled={uploading === room.id}
                          onChange={(e) => e.target.files?.[0] && handleImageUpload(room.id, e.target.files[0])} />
                      </label>
                      <button onClick={() => setModal({ open: true, room })} className="p-1.5 text-gray-500 hover:text-primary hover:bg-gray-100 rounded"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(room.id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {!rooms.length && <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No rooms yet. Add one!</td></tr>}
          </tbody>
        </table>
      </div>

      {modal.open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-semibold text-gray-900">{modal.room ? 'Edit Room' : 'Add New Room'}</h2>
              <button onClick={() => setModal({ open: false })}><X className="h-5 w-5 text-gray-500" /></button>
            </div>
            <div className="p-5">
              <RoomForm room={modal.room} onSuccess={() => { setModal({ open: false }); refresh() }} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
