'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, BedDouble, CalendarCheck, CreditCard, LogOut, Menu, X } from 'lucide-react'
import { signOut } from 'next-auth/react'

const nav = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/rooms', label: 'Rooms', icon: BedDouble },
  { href: '/admin/bookings', label: 'Bookings', icon: CalendarCheck },
  { href: '/admin/payments', label: 'Payments', icon: CreditCard },
]

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const path = usePathname()
  return (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-blue-800 flex items-center justify-between">
        <div>
          <p className="font-serif text-lg font-bold text-white">GrandStay</p>
          <p className="text-blue-300 text-xs">Admin</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-blue-300 hover:text-white md:hidden">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${path === href ? 'bg-amber-500 text-white' : 'text-blue-200 hover:bg-blue-800 hover:text-white'}`}>
            <Icon className="h-4 w-4" />{label}
          </Link>
        ))}
      </nav>
      <div className="p-3 border-t border-blue-800">
        <button onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-blue-200 hover:bg-blue-800 hover:text-white transition-colors w-full">
          <LogOut className="h-4 w-4" />Sign Out
        </button>
      </div>
    </div>
  )
}

export function AdminSidebar() {
  const [open, setOpen] = useState(false)
  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-primary z-40 flex items-center px-4 gap-3 border-b border-blue-800">
        <button onClick={() => setOpen(true)} className="text-white p-1">
          <Menu className="h-5 w-5" />
        </button>
        <p className="font-serif text-base font-bold text-white">GrandStay Admin</p>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-56 bg-primary min-h-screen flex-shrink-0">
            <SidebarContent onClose={() => setOpen(false)} />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setOpen(false)} />
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 bg-primary min-h-screen flex-col flex-shrink-0">
        <SidebarContent />
      </aside>
    </>
  )
}
