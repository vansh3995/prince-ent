"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Package, MapPin, Clock, CheckCircle, Truck, AlertCircle } from "lucide-react"

interface TrackingData {
  awb: string
  status: string
  origin: string
  destination: string
  estimatedDelivery: string
  currentLocation: string
  progress: number
  updates: {
    date: string
    status: string
    location: string
    description: string
  }[]
}

interface TrackingFormProps {
  minimal?: boolean
}

export default function TrackingForm({ minimal = false }: TrackingFormProps) {
  const [awbNumber, setAwbNumber] = useState("")
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!awbNumber.trim()) {
      setError("Please enter a tracking number")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Mock API call with demo data
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock tracking data
      const mockData: TrackingData = {
        awb: awbNumber,
        status: "In Transit",
        origin: "Mumbai",
        destination: "Delhi",
        estimatedDelivery: "2024-01-15",
        currentLocation: "Pune Hub",
        progress: 65,
        updates: [
          {
            date: "2024-01-12 10:30 AM",
            status: "Picked Up",
            location: "Mumbai",
            description: "Package picked up from sender"
          },
          {
            date: "2024-01-12 2:45 PM",
            status: "In Transit",
            location: "Mumbai Hub",
            description: "Package sorted and dispatched"
          },
          {
            date: "2024-01-13 6:20 AM",
            status: "In Transit",
            location: "Pune Hub",
            description: "Package arrived at transit hub"
          }
        ]
      }
      
      setTrackingData(mockData)
    } catch (error) {
      setError("Failed to fetch tracking information")
      setTrackingData(null)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "in transit":
        return <Truck className="w-5 h-5 text-blue-600" />
      case "picked up":
        return <Package className="w-5 h-5 text-yellow-600" />
      default:
        return <Clock className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "text-green-600 bg-green-50"
      case "in transit":
        return "text-blue-600 bg-blue-50"
      case "picked up":
        return "text-yellow-600 bg-yellow-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  // Minimal version for homepage
  if (minimal) {
    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex space-x-2">
          <input
            type="text"
            value={awbNumber}
            onChange={(e) => setAwbNumber(e.target.value)}
            className="flex-1 px-3 py-2 border border-white/20 rounded-md bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
            placeholder="Enter AWB number"
          />
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading ? "..." : "Track"}
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
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Package Tracking</span>
          </CardTitle>
          <CardDescription>
            Enter your AWB number to track your package
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="awb" className="block text-sm font-medium text-gray-700 mb-1">
                AWB Number
              </label>
              <div className="flex space-x-2">
                <input
                  id="awb"
                  type="text"
                  value={awbNumber}
                  onChange={(e) => setAwbNumber(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter AWB number (e.g., AWB123456789)"
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Searching..." : "Track"}
                </Button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                {error}
              </div>
            )}
          </form>

          {trackingData && (
            <div className="mt-6 space-y-6">
              {/* Package Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="w-5 h-5" />
                    <span>Package Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">AWB Number</p>
                      <p className="font-medium">{trackingData.awb}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(trackingData.status)}`}>
                        {getStatusIcon(trackingData.status)}
                        <span className="ml-1">{trackingData.status}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Origin</p>
                      <p className="font-medium flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {trackingData.origin}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Destination</p>
                      <p className="font-medium flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {trackingData.destination}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Current Location</p>
                      <p className="font-medium">{trackingData.currentLocation}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Estimated Delivery</p>
                      <p className="font-medium flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {trackingData.estimatedDelivery}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{trackingData.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${trackingData.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tracking Updates */}
              <Card>
                <CardHeader>
                  <CardTitle>Tracking Updates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trackingData.updates.map((update, index) => (
                      <div key={index} className="flex items-start space-x-3 pb-4 border-b last:border-b-0">
                        <div className="flex-shrink-0 mt-1">
                          {getStatusIcon(update.status)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{update.status}</p>
                            <p className="text-sm text-gray-500">{update.date}</p>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{update.description}</p>
                          <p className="text-sm text-gray-500 flex items-center mt-1">
                            <MapPin className="w-3 h-3 mr-1" />
                            {update.location}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Demo AWB Numbers */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Demo AWB Numbers</CardTitle>
          <CardDescription>
            Try these demo AWB numbers to see the tracking in action
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {["AWB123456789", "AWB987654321", "AWB555666777"].map((awb) => (
              <button
                key={awb}
                onClick={() => setAwbNumber(awb)}
                className="px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded border border-blue-200 hover:bg-blue-100 transition-colors"
              >
                {awb}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}