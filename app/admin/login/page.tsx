"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import toast, { Toaster } from "react-hot-toast"

export default function AdminLogin() {
  const [email, setEmail] = useState("superadmin@princeent.com")
  const [password, setPassword] = useState("superadmin123")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log("🔐 Attempting login with:", email)

      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Important for cookies
      })

      const data = await response.json()
      console.log("📝 Login response:", data)

      if (data.success) {
        toast.success("Login successful!")
        // Store user data in localStorage for client-side access
        localStorage.setItem("admin-user", JSON.stringify(data.user))
        setTimeout(() => {
          router.push("/admin/bookings")
        }, 1000)
      } else {
        toast.error(data.message || "Login failed")
        console.error("❌ Login failed:", data)
      }
    } catch (error) {
      console.error("❌ Login error:", error)
      toast.error("Login failed - network error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Prince Enterprises Admin Portal
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>

          <div className="text-xs text-gray-500 text-center bg-gray-100 p-3 rounded">
            <p className="font-semibold">Test Credentials:</p>
            <p>📧 Email: superadmin@princeent.com</p>
            <p>🔑 Password: superadmin123</p>
          </div>
        </form>
      </div>
    </div>
  )
}