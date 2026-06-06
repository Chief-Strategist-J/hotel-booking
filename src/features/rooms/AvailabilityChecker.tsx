'use client'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

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
        <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
        <input type="date" {...register('checkIn', { required: 'Required' })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        {errors.checkIn && <p className="text-red-500 text-xs mt-1">{errors.checkIn.message}</p>}
      </div>
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
        <input type="date" {...register('checkOut', { required: 'Required' })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        {errors.checkOut && <p className="text-red-500 text-xs mt-1">{errors.checkOut.message}</p>}
      </div>
      <div className="sm:self-end">
        <button type="submit"
          className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-medium px-6 py-[0.5625rem] rounded-lg transition-colors whitespace-nowrap">
          {roomId ? 'Book Now' : 'Check Availability'}
        </button>
      </div>
    </form>
  )
}
