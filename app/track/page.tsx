"use client"
import { useState } from "react"

export default function TrackBookingPage() {
  const [bookingId, setBookingId] = useState("")
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setResult(null)
    const res = await fetch(`/api/bookings/${bookingId}`)
    if (res.ok) {
      const data = await res.json()
      setResult(data.booking)
    } else {
      setError("Booking not found.")
    }
  }

  return (
    <div className="max-w-md mx-auto py-12">
      <h1 className="text-2xl font-bold mb-4">Track Your Booking</h1>
      <form onSubmit={handleTrack} className="flex gap-2 mb-4">
        <input
          className="border px-3 py-2 rounded w-full"
          placeholder="Enter Booking ID"
          value={bookingId}
          onChange={e => setBookingId(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
          Track
        </button>
      </form>
      {error && <p className="text-red-600">{error}</p>}
      {result && (
        <div className="bg-gray-100 p-4 rounded">
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}