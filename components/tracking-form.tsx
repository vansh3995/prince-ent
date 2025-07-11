"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Search, Loader2 } from "lucide-react"

interface TrackingFormProps {
  minimal?: boolean
}

export default function TrackingForm({ minimal = false }: TrackingFormProps) {
  const [trackingNumber, setTrackingNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!trackingNumber.trim()) {
      setError("Please enter a tracking number")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Navigate to the tracking page with the tracking number
      router.push(`/track/${trackingNumber.trim()}`)
    } catch (error) {
      setError("Failed to track shipment")
    } finally {
      setIsLoading(false)
    }
  }

  // Minimal version for homepage
  if (minimal) {
    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex space-x-2">
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            className="flex-1 px-3 py-2 border border-white/20 rounded-md bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
            placeholder="Enter AWB number"
          />
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Track"}
          </Button>
        </div>
        {error && (
          <p className="text-red-200 text-sm">{error}</p>
        )}
      </form>
    )
  }

  // Full version for tracking page
  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="trackingNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Tracking Number
          </label>
          <div className="flex space-x-2">
            <input
              id="trackingNumber"
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter AWB number (e.g., AWB123456789)"
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Demo AWB Numbers */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800 font-medium mb-2">Try these demo AWB numbers:</p>
          <div className="flex flex-wrap gap-2">
            {["AWB123456789", "AWB987654321", "AWB555666777"].map((awb) => (
              <button
                key={awb}
                type="button"
                onClick={() => setTrackingNumber(awb)}
                className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded border border-blue-200 hover:bg-blue-200 transition-colors"
              >
                {awb}
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  )
}