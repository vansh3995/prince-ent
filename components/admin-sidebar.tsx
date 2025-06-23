"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart2, FileText, List, LayoutDashboard, Bell } from "lucide-react"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

const adminLinks = [
  { name: "Dashboard", href: "/admin", icon: <LayoutDashboard className="mr-2 h-5 w-5" /> },
  { name: "Bookings", href: "/admin/bookings", icon: <List className="mr-2 h-5 w-5" /> },
  { name: "Quotes", href: "/admin/quotes", icon: <FileText className="mr-2 h-5 w-5" /> },
  { name: "Analytics", href: "/admin/analytics", icon: <BarChart2 className="mr-2 h-5 w-5" /> },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [notifCount, setNotifCount] = useState(0)
  const { data: session } = useSession()
  const role = session?.user?.role

  useEffect(() => {
    fetch("/api/notifications")
      .then(res => res.json())
      .then(data => {
        setNotifCount(data.notifications.filter((n: any) => !n.read).length)
      })
  }, [])

  return (
    <aside className="w-56 min-h-screen bg-white border-r px-4 py-8">
      <h2 className="text-lg font-bold mb-8 text-red-600 flex items-center">
        Admin Panel
        <span className="ml-auto relative">
          <Bell className="h-5 w-5 text-red-500" />
          {notifCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs px-2">
              {notifCount}
            </span>
          )}
        </span>
      </h2>
      <nav className="flex flex-col gap-4">
        {adminLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center px-3 py-2 rounded hover:bg-red-50 font-medium transition",
              pathname === link.href ? "bg-red-100 text-red-700" : "text-gray-700"
            )}
          >
            {link.icon}
            {link.name}
          </Link>
        ))}
        {role === "superadmin" && (
          <Link
            href="/admin/staff"
            className={cn(
              "flex items-center px-3 py-2 rounded hover:bg-red-50 font-medium transition",
              pathname === "/admin/staff" ? "bg-red-100 text-red-700" : "text-gray-700"
            )}
          >
            {/* icon yahan */}
            Staff Management
          </Link>
        )}
      </nav>
    </aside>
  )
}