import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { AdminSidebar } from '@/components/AdminSidebar'
import { SessionProvider } from '@/components/SessionProvider'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  return (
    <SessionProvider session={session}>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        {/* pt-14 on mobile offsets the fixed top bar; md:pt-0 resets for desktop */}
        <main className="flex-1 p-4 md:p-8 overflow-auto pt-[calc(3.5rem+1rem)] md:pt-8">
          {children}
        </main>
      </div>
    </SessionProvider>
  )
}
