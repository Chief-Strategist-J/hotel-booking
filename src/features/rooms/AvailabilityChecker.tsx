'use client'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { CalendarDays, Search } from 'lucide-react'

interface FormData { checkIn: string; checkOut: string }
interface Props { roomId?: string; defaultCheckIn?: string; defaultCheckOut?: string }

export function AvailabilityChecker({ roomId, defaultCheckIn, defaultCheckOut }: Props) {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: { checkIn: defaultCheckIn || '', checkOut: defaultCheckOut || '' },
  })

  const onSubmit = (data: FormData) => {
    if (roomId) {
      router.push(`/booking?roomId=${roomId}&checkIn=${data.checkIn}&checkOut=${data.checkOut}`)
    } else {
      router.push(`/rooms?checkIn=${data.checkIn}&checkOut=${data.checkOut}`)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Check-in</label>
        <div className="relative">
          <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input type="date" {...register('checkIn', { required: 'Required' })}
            className="input pl-10" />
        </div>
        {errors.checkIn && <p className="text-red-500 text-xs mt-1">{errors.checkIn.message}</p>}
      </div>
      <div className="flex-1">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Check-out</label>
        <div className="relative">
          <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input type="date" {...register('checkOut', { required: 'Required' })}
            className="input pl-10" />
        </div>
        {errors.checkOut && <p className="text-red-500 text-xs mt-1">{errors.checkOut.message}</p>}
      </div>
      <div className="sm:self-end">
        <button type="submit" className="btn-primary w-full sm:w-auto gap-2">
          <Search className="h-4 w-4" />
          {roomId ? 'Book Now' : 'Check'}
        </button>
      </div>
    </form>
  )
}
