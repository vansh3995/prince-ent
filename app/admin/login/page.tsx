import type { Metadata, Viewport } from "next"
import AdminLoginForm from "@/components/admin/AdminLoginForm"

export const metadata: Metadata = {
  title: "Admin Login - Prince Enterprises",
  description: "Admin login for Prince Enterprises logistics management system",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access the admin dashboard
          </p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  )
}