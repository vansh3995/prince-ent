"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface TrackingFormProps {
  minimal?: boolean
  className?: string
}

export default function TrackingForm({ minimal = false, className }: TrackingFormProps) {
  const [trackingNumber, setTrackingNumber] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (trackingNumber.trim()) {
      router.push(`/track?id=${encodeURIComponent(trackingNumber.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("flex gap-2", className)}>
      <Input
        placeholder="Enter tracking number"
        value={trackingNumber}
        onChange={(e) => setTrackingNumber(e.target.value)}
        className={cn(minimal && "bg-white/20 border-white/30 text-white placeholder:text-white/70")}
        required
      />
      <Button type="submit" className={cn(!minimal && "bg-red-600 hover:bg-red-700")}>
        <Search className="h-4 w-4" />
      </Button>
    </form>
  )
}
