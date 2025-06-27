"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart2, FileText, List, LayoutDashboard, Bell, Users, LogOut } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { useAdminAuth } from "@/context/admin-auth-context"

const adminLinks = [
  { name: "Dashboard", href: "/admin", icon: <LayoutDashboard className="mr-2 h-5 w-5" /> },
  { name: "Bookings", href: "/admin/bookings", icon: <List className="mr-2 h-5 w-5" /> },
  { name: "Quotes", href: "/admin/quotes", icon: <FileText className="mr-2 h-5 w-5" /> },
  { name: "Analytics", href: "/admin/analytics", icon: <BarChart2 className="mr-2 h-5 w-5" /> },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [notifCount, setNotifCount] = useState(0)
  const [notifOpen, setNotifOpen] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)
  const { user, logout } = useAdminAuth()

  useEffect(() => {
    fetch("/api/notifications")
      .then(res => res.json())
      .then(data => {
        setNotifCount(data.notifications.filter((n: any) => !n.read).length)
      })
      .catch(error => {
        console.error('Error fetching notifications:', error)
      })
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [notifRef])

  const handleLogout = () => {
    logout()
  }

  return (
    <aside className="w-56 min-h-screen bg-white border-r px-4 py-8 flex flex-col">
      <div className="flex-1">
        <h2 className="text-lg font-bold mb-8 text-red-600 flex items-center">
          Admin Panel
          <span className="ml-auto relative" ref={notifRef}>
            <Bell
              className="h-5 w-5 text-red-500 cursor-pointer"
              onClick={() => setNotifOpen(!notifOpen)}
            />
            {notifCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs px-2">
                {notifCount}
              </span>
            )}
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-lg z-50 p-4">
                <h3 className="font-semibold mb-2">Notifications</h3>
                <p className="text-sm text-gray-700">You have {notifCount} unread notifications.</p>
                {/* You can expand this to list notifications */}
              </div>
            )}
          </span>
        </h2>
        
        {user && (
          <div className="mb-6 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
            <p className="text-xs text-red-600 font-medium capitalize">{user.role}</p>
          </div>
        )}
        
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
          {user?.role === "superadmin" && (
            <Link
              href="/admin/staff"
              className={cn(
                "flex items-center px-3 py-2 rounded hover:bg-red-50 font-medium transition",
                pathname === "/admin/staff" ? "bg-red-100 text-red-700" : "text-gray-700"
              )}
            >
              <Users className="mr-2 h-5 w-5" />
              Staff Management
            </Link>
          )}
        </nav>
      </div>
      
      <div className="mt-auto pt-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center px-3 py-2 rounded hover:bg-red-50 font-medium transition text-gray-700 w-full"
        >
          <LogOut className="mr-2 h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  )
}
