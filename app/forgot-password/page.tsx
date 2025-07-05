"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import toast from "react-hot-toast"

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1) // 1: enter email, 2: enter OTP and new password
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const requestOtp = async () => {
    if (!email) {
      toast.error("Please enter your email")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success("OTP sent to your email")
        setStep(2)
      } else {
        toast.error(data.error || "Failed to send OTP")
      }
    } catch (error) {
      toast.error("Failed to send OTP")
    }
    setLoading(false)
  }

  const verifyOtpAndReset = async () => {
    if (!otp || !newPassword) {
      toast.error("Please enter OTP and new password")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success("Password reset successful. Please login.")
        router.push("/admin/login")
      } else {
        toast.error(data.error || "Failed to reset password")
      }
    } catch (error) {
      toast.error("Failed to reset password")
    }
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
      {step === 1 && (
        <>
          <label className="block mb-2">Email</label>
          <input
            type="email"
            className="w-full border px-3 py-2 rounded mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          <button
            onClick={requestOtp}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </>
      )}
      {step === 2 && (
        <>
          <label className="block mb-2">OTP</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded mb-4"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
          />
          <label className="block mb-2">New Password</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded mb-4"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
          />
          <button
            onClick={verifyOtpAndReset}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </>
      )}
    </div>
  )
}

export default dynamic(() => Promise.resolve(ForgotPasswordPage), { ssr: false })
