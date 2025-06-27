"use client"

import { useState, useEffect } from "react"

interface TrackingEvent {
  id: string
  timestamp: string
  status: string
  location: string
  description: string
}

interface Parcel {
  awb: string
  status: string
  events?: TrackingEvent[]
  senderName?: string
  receiverName?: string
  weight?: number
  estimatedDelivery?: string
}

const statusOrder = [
  "booked",
  "picked-up",
  "in-transit",
  "out-for-delivery",
  "delivered",
  "exception",
  "cancelled"
]

function getStatusIndex(status: string) {
  return statusOrder.indexOf(status.toLowerCase())
}

export default function TrackPage() {
  const [awb, setAwb] = useState("")
  const [parcel, setParcel] = useState<Parcel | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const fetchTracking = async () => {
    setLoading(true)
    setError("")
    setParcel(null)
    try {
      const res = await fetch(`/api/track/${awb}`)
      if (!res.ok) {
        setError("Tracking number not found")
        setLoading(false)
        return
      }
      const data = await res.json()
      setParcel(data.parcel)
    } catch (err) {
      setError("Failed to fetch tracking info")
    } finally {
      setLoading(false)
    }
  }

  const currentStatusIndex = parcel ? getStatusIndex(parcel.status) : -1

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Track Your Shipment</h1>
        <div className="flex space-x-4 mb-6">
          <input
            type="text"
            placeholder="Enter AWB Number"
            value={awb}
            onChange={(e) => setAwb(e.target.value.toUpperCase())}
            className="flex-grow border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
          />
          <button
            onClick={fetchTracking}
            disabled={!awb || loading}
            className="bg-red-600 text-white px-6 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Loading..." : "Track"}
          </button>
        </div>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        {parcel && (
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-xl font-semibold mb-2">AWB: {parcel.awb}</h2>
            <p className="mb-4">Status: <strong>{parcel.status}</strong></p>
            {parcel.estimatedDelivery && (
              <p className="mb-4">Estimated Delivery: <strong>{new Date(parcel.estimatedDelivery).toLocaleDateString()}</strong></p>
            )}
            {parcel.weight && <p>Weight: {parcel.weight} kg</p>}
            {parcel.senderName && <p>Sender: {parcel.senderName}</p>}
            {parcel.receiverName && <p>Receiver: {parcel.receiverName}</p>}

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Progress</h3>
              <div className="flex space-x-2">
                {statusOrder.map((status, index) => (
                  <div key={status} className="flex-1 text-center">
                    <div
                      className={`mx-auto w-6 h-6 rounded-full ${
                        index <= currentStatusIndex ? "bg-red-600" : "bg-gray-300"
                      }`}
                    />
                    <p className="text-xs mt-1 capitalize">{status.replace(/-/g, " ")}</p>
                  </div>
                ))}
              </div>
            </div>

            <h3 className="mt-6 mb-2 font-semibold">Tracking Events:</h3>
            {parcel.events && parcel.events.length > 0 ? (
              <ul className="space-y-3 max-h-64 overflow-y-auto">
                {parcel.events.map((event) => (
                  <li key={event.id} className="border-l-4 border-red-600 pl-4">
                    <p><strong>{event.status}</strong> at {event.location}</p>
                    <p className="text-sm text-gray-600">{new Date(event.timestamp).toLocaleString()}</p>
                    <p>{event.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No tracking events available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
