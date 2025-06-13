import type { Metadata } from "next"
import RegisterForm from "@/components/auth/register-form"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Register - Prince Enterprises",
  description: "Create a new account with Prince Enterprises",
}

export default function RegisterPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Create an Account</h1>
          <p className="text-gray-600 mt-2">
            Join Prince Enterprises to access exclusive features and manage your shipments
          </p>
        </div>

        <RegisterForm />

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-red-600 hover:underline font-medium">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
