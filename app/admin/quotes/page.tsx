"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAdminAuth } from "@/context/admin-auth-context"

export default function AdminQuotesPage() {
  const { admin, isLoading } = useAdminAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !admin) {
      router.push("/admin/login")
    }
  }, [admin, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!admin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Quote Requests</h1>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600">Quote management coming soon...</p>
        </div>
      </div>
    </div>
  )
}
