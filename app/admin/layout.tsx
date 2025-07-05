﻿"use client"

import { AdminAuthProvider } from "@/context/admin-auth-context"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminAuthProvider>
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </AdminAuthProvider>
  )
}
