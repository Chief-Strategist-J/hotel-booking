'use client'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { CalendarDays, Search } from 'lucide-react'

interface FormData { checkIn: string; checkOut: string }
interface Props {
  roomId?: string
  defaultCheckIn?: string
  defaultCheckOut?: string
  /** "row" = side-by-side on sm+ (use in full-width sticky bars).
      "col" (default) = always stacked (use inside narrow cards). */
  layout?: 'row' | 'col'
}

export function AvailabilityChecker({ roomId, defaultCheckIn, defaultCheckOut, layout = 'col' }: Props) {
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

  const isRow = layout === 'row'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`flex gap-3 ${isRow ? 'flex-col sm:flex-row' : 'flex-col'}`}>
      <div className="flex-1 min-w-0">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Check-in</label>
        <div className="relative">
          <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            type="date"
            {...register('checkIn', { required: 'Required' })}
            className="w-full border border-gray-200 rounded-xl pl-10 pr-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
        {errors.checkIn && <p className="text-red-500 text-xs mt-1">{errors.checkIn.message}</p>}
      </div>

      <div className="flex-1 min-w-0">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Check-out</label>
        <div className="relative">
          <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            type="date"
            {...register('checkOut', { required: 'Required' })}
            className="w-full border border-gray-200 rounded-xl pl-10 pr-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
        {errors.checkOut && <p className="text-red-500 text-xs mt-1">{errors.checkOut.message}</p>}
      </div>

      <div className={isRow ? 'sm:self-end' : ''}>
        <button
          type="submit"
          className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-800 text-white font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 hover:shadow-md active:scale-95 text-sm"
        >
          <Search className="h-4 w-4" />
          {roomId ? 'Book Now' : 'Check Availability'}
        </button>
      </div>
    </form>
  )
}
