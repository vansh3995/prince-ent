"use client"

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface TrackingFormProps {
  minimal?: boolean
}

export default function TrackingForm({ minimal = false }: TrackingFormProps) {
  const [trackingNumber, setTrackingNumber] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (trackingNumber.trim()) {
      window.location.href = `/track?number=${encodeURIComponent(trackingNumber.trim())}`
    }
  }

  if (minimal) {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter tracking number"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
        />
        <Button 
          type="submit" 
          size="sm"
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          <Search className="h-4 w-4" />
        </Button>
      </form>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md">
      <h3 className="text-lg font-semibold mb-4">Track Your Shipment</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="text"
            placeholder="Enter your tracking number"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
          <Search className="mr-2 h-4 w-4" />
          Track Package
        </Button>
      </form>
    </div>
  )
}
