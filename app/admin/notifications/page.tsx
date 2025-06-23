"use client"
import { useEffect, useState } from "react"

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/notifications")
      .then(res => res.json())
      .then(data => setNotifications(data.notifications))
  }, [])

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      <div className="space-y-2">
        {notifications.map((n) => (
          <div key={n._id} className={`p-3 rounded ${n.read ? "bg-gray-100" : "bg-yellow-50"}`}>
            <span className="font-medium">{n.type === "booking" ? "Booking" : "Quote"}:</span> {n.message}
            <span className="block text-xs text-gray-500">{new Date(n.createdAt).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  )
}