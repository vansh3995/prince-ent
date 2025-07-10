import type { Metadata, Viewport } from "next"
import TrackingForm from "@/components/tracking-form"

export const metadata: Metadata = {
  title: "Track Package - Prince Enterprises",
  description: "Track your shipment with Prince Enterprises",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function TrackPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Package</h1>
          <p className="text-gray-600">
            Enter your tracking number to get real-time updates on your shipment
          </p>
        </div>
        <TrackingForm />
      </div>
    </div>
  )
}