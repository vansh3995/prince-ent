"use client"

import { useState, useEffect } from "react"
import { Search, Package, Truck, CheckCircle, Clock, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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

  // Check for tracking number in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const number = urlParams.get('number')
    if (number) {
      setAwb(number.toUpperCase())
      // Auto-fetch if URL has tracking number
      fetchTrackingWithNumber(number.toUpperCase())
    }
  }, [])

  const fetchTrackingWithNumber = async (trackingNumber: string) => {
    setLoading(true)
    setError("")
    setParcel(null)
    
    try {
      // Try API first
      const res = await fetch(`/api/track/${trackingNumber}`)
      if (res.ok) {
        const data = await res.json()
        setParcel(data.parcel)
        setLoading(false)
        return
      }
      
      // Fallback to mock data if API fails
      setTimeout(() => {
        const mockParcel: Parcel = {
          awb: trackingNumber,
          status: "in-transit",
          senderName: "Prince Enterprises Mumbai",
          receiverName: "Customer Delhi",
          weight: 2.5,
          estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          events: [
            {
              id: "1",
              timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              status: "booked",
              location: "Mumbai Hub",
              description: "Package has been booked and is ready for pickup"
            },
            {
              id: "2", 
              timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              status: "picked-up",
              location: "Mumbai Hub",
              description: "Package picked up from sender"
            },
            {
              id: "3",
              timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
              status: "in-transit",
              location: "Pune Transit Hub",
              description: "Package is in transit to destination"
            }
          ]
        }
        setParcel(mockParcel)
        setLoading(false)
      }, 1000)
      
    } catch (err) {
      setError("Failed to fetch tracking info")
      setLoading(false)
    }
  }

  const fetchTracking = async () => {
    if (!awb.trim()) return
    await fetchTrackingWithNumber(awb.trim())
  }

  const currentStatusIndex = parcel ? getStatusIndex(parcel.status) : -1

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'text-green-600'
      case 'exception':
      case 'cancelled': return 'text-red-600'
      case 'out-for-delivery': return 'text-blue-600'
      case 'in-transit': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Track Your Shipment</h1>
      
      {/* Search Form */}
      <Card className="max-w-md mx-auto mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="mr-2 h-5 w-5" />
            Enter Tracking Number
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Enter AWB Number"
              value={awb}
              onChange={(e) => setAwb(e.target.value.toUpperCase())}
              className="flex-grow"
            />
            <Button
              onClick={fetchTracking}
              disabled={!awb || loading}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? (
                <Clock className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      )}

      {/* Tracking Results */}
      {parcel && (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Package Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="mr-2 h-5 w-5" />
                Tracking Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">AWB Number</p>
                  <p className="font-semibold text-lg">{parcel.awb}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className={`font-semibold text-lg capitalize ${getStatusColor(parcel.status)}`}>
                    {parcel.status.replace(/-/g, ' ')}
                  </p>
                </div>
                {parcel.weight && (
                  <div>
                    <p className="text-sm text-gray-600">Weight</p>
                    <p className="font-semibold">{parcel.weight} kg</p>
                  </div>
                )}
                {parcel.estimatedDelivery && (
                  <div>
                    <p className="text-sm text-gray-600">Est. Delivery</p>
                    <p className="font-semibold">
                      {new Date(parcel.estimatedDelivery).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Sender/Receiver Info */}
              {(parcel.senderName || parcel.receiverName) && (
                <div className="flex items-center justify-center space-x-8 p-4 bg-gray-50 rounded-lg mt-4">
                  {parcel.senderName && (
                    <div className="text-center">
                      <p className="text-sm text-gray-600">From</p>
                      <p className="font-semibold">{parcel.senderName}</p>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Truck className="h-6 w-6 text-blue-600" />
                    <div className="w-16 h-1 bg-blue-600 mx-2"></div>
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  {parcel.receiverName && (
                    <div className="text-center">
                      <p className="text-sm text-gray-600">To</p>
                      <p className="font-semibold">{parcel.receiverName}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Progress Bar */}
          <Card>
            <CardHeader>
              <CardTitle>Shipment Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                {statusOrder.slice(0, 5).map((status, index) => (
                  <div key={status} className="flex flex-col items-center flex-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index <= currentStatusIndex 
                          ? "bg-red-600 text-white" 
                          : "bg-gray-300 text-gray-500"
                      }`}
                    >
                      {index <= currentStatusIndex ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <div className="w-3 h-3 bg-current rounded-full" />
                      )}
                    </div>
                    <p className="text-xs mt-2 text-center capitalize font-medium">
                      {status.replace(/-/g, ' ')}
                    </p>
                    {index < 4 && (
                      <div 
                        className={`h-1 w-full mt-4 ${
                          index < currentStatusIndex ? 'bg-red-600' : 'bg-gray-300'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Tracking Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              {parcel.events && parcel.events.length > 0 ? (
                <div className="space-y-4">
                  {parcel.events.map((event, index) => (
                    <div key={event.id} className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mt-1">
                        <div className="w-3 h-3 bg-red-600 rounded-full" />
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-red-600 capitalize">
                              {event.status.replace(/-/g, ' ')}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {event.location}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(event.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-700 mt-1">{event.description}</p>
                        {index < parcel.events!.length - 1 && (
                          <div className="w-0.5 h-8 bg-gray-300 ml-4 mt-2"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No tracking events available.</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
