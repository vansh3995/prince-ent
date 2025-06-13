import type { Metadata } from "next"
import LoginForm from "@/components/auth/login-form"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Login - Prince Enterprises",
  description: "Login to your Prince Enterprises account",
}

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Login to Your Account</h1>
          <p className="text-gray-600 mt-2">
            Access your Prince Enterprises account to track shipments and manage bookings
          </p>
        </div>

        <LoginForm />

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link href="/register" className="text-red-600 hover:underline font-medium">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
