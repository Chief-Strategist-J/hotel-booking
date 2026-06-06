'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, BedDouble, CalendarCheck, CreditCard, LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'

const nav = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/rooms', label: 'Rooms', icon: BedDouble },
  { href: '/admin/bookings', label: 'Bookings', icon: CalendarCheck },
  { href: '/admin/payments', label: 'Payments', icon: CreditCard },
]

export function AdminSidebar() {
  const path = usePathname()
  return (
    <aside className="w-56 bg-primary min-h-screen flex flex-col flex-shrink-0">
      <div className="p-5 border-b border-blue-800">
        <p className="font-serif text-lg font-bold text-white">GrandStay</p>
        <p className="text-blue-300 text-xs">Admin</p>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${path === href ? 'bg-amber-500 text-white' : 'text-blue-200 hover:bg-blue-800 hover:text-white'}`}>
            <Icon className="h-4 w-4" />{label}
          </Link>
        ))}
      </nav>
      <div className="p-3 border-t border-blue-800">
        <button onClick={() => signOut({ callbackUrl: '/admin/login' })} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-blue-200 hover:bg-blue-800 hover:text-white transition-colors w-full">
          <LogOut className="h-4 w-4" />Sign Out
        </button>
      </div>
    </aside>
  )
}
