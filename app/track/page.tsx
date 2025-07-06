"use client"

import { useState } from 'react'
import { Search, Package, MapPin, Clock, CheckCircle, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function TrackPage() {
  const [awbNumber, setAwbNumber] = useState('')
  const [trackingData, setTrackingData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!awbNumber.trim()) {
      setError('Please enter a valid AWB number')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(`/api/track/${awbNumber}`)
      const data = await response.json()
      
      if (response.ok) {
        setTrackingData(data)
      } else {
        setError(data.message || 'Shipment not found')
        setTrackingData(null)
      }
    } catch (error) {
      setError('Failed to track shipment. Please try again.')
      setTrackingData(null)
    }
    
    setLoading(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'in-transit':
      case 'in_transit':
        return <Truck className="h-5 w-5 text-blue-600" />
      case 'picked-up':
      case 'picked_up':
        return <Package className="h-5 w-5 text-yellow-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'text-green-600 bg-green-50'
      case 'in-transit':
      case 'in_transit':
        return 'text-blue-600 bg-blue-50'
      case 'picked-up':
      case 'picked_up':
        return 'text-yellow-600 bg-yellow-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Track Your Shipment</h1>
          <p className="text-gray-600">Enter your AWB number to track your package in real-time</p>
        </div>

        {/* Tracking Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Track Package</span>
            </CardTitle>
            <CardDescription>
              Enter your Air Waybill (AWB) number to get real-time tracking information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTrack} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AWB Number
                </label>
                <input
                  type="text"
                  value={awbNumber}
                  onChange={(e) => setAwbNumber(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter your AWB number (e.g., AWB123456789)"
                  required
                />
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                {loading ? 'Tracking...' : 'Track Package'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Tracking Results */}
        {trackingData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Tracking Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Package Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">AWB Number</h3>
                    <p className="text-lg font-semibold">{trackingData.awb}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Current Status</h3>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(trackingData.status)}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trackingData.status)}`}>
                        {trackingData.status?.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">From</h3>
                    <p className="text-lg">{trackingData.from || trackingData.origin}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">To</h3>
                    <p className="text-lg">{trackingData.to || trackingData.destination}</p>
                  </div>
                </div>

                {/* Timeline */}
                {trackingData.timeline && trackingData.timeline.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Tracking Timeline</h3>
                    <div className="space-y-4">
                      {trackingData.timeline.map((event: any, index: number) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-3 h-3 bg-red-600 rounded-full mt-2"></div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">{event.status}</p>
                              <p className="text-sm text-gray-500">{event.timestamp}</p>
                            </div>
                            {event.location && (
                              <div className="flex items-center space-x-1 text-sm text-gray-600">
                                <MapPin className="h-4 w-4" />
                                <span>{event.location}</span>
                              </div>
                            )}
                            {event.description && (
                              <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Expected Delivery */}
                {trackingData.expectedDelivery && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-900">Expected Delivery</p>
                        <p className="text-blue-700">{trackingData.expectedDelivery}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Demo Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Try Demo Tracking</CardTitle>
            <CardDescription>
              Use these demo AWB numbers to see how tracking works
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setAwbNumber('AWB123456789')}
                className="p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium">AWB123456789</div>
                <div className="text-sm text-gray-600">Delivered</div>
              </button>
              <button
                onClick={() => setAwbNumber('AWB987654321')}
                className="p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium">AWB987654321</div>
                <div className="text-sm text-gray-600">In Transit</div>
              </button>
              <button
                onClick={() => setAwbNumber('AWB555666777')}
                className="p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium">AWB555666777</div>
                <div className="text-sm text-gray-600">Picked Up</div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
