"use client"
import AdminSidebar from "@/components/admin-sidebar"
import { usePathname, useRouter } from "next/navigation"
import { AdminAuthProvider, useAdminAuth } from "@/context/admin-auth-context"

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { isLoading, isAuthenticated } = useAdminAuth()

  // Don't show sidebar on login page
  if (pathname === '/admin/login') {
    return <main className="bg-gray-50 min-h-screen">{children}</main>
  }

  // Redirect to login if not authenticated (but not loading)
  if (!isLoading && !isAuthenticated) {
    router.push('/admin/login')
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-8 bg-gray-50 min-h-screen">{children}</main>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminAuthProvider>
  )
}
