"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react"

export default function LoginForm() {
  const { login } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/dashboard'

  const [formData, setFormData] = useState({
    email: "demo@example.com",
    password: "demo123"
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      console.log("🔐 Login form submitting:", formData.email)
      
      const result = await login(formData.email, formData.password)
      
      console.log("🎯 Login result:", result)
      
      if (result.success) {
        console.log("✅ Login successful, redirecting to:", redirectTo)
        // Small delay to ensure state is updated
        setTimeout(() => {
          router.push(redirectTo)
          router.refresh()
        }, 100)
      } else {
        setError(result.message || "Login failed")
      }
    } catch (error) {
      console.error("❌ Login error:", error)
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Sign In</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="pl-10"
                placeholder="Enter your email"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className="pl-10 pr-10"
                placeholder="Enter your password"
                disabled={isLoading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </div>
            ) : (
              "Sign In"
            )}
          </Button>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-sm text-blue-800 font-medium mb-2">Demo Credentials:</p>
            <p className="text-sm text-blue-700">📧 Email: demo@example.com</p>
            <p className="text-sm text-blue-700">🔐 Password: demo123</p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}