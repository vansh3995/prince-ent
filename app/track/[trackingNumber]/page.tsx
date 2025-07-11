"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ShipmentDetails from "@/components/shipment-details"
import { Shipment } from "@/types/shipment"
import { Loader2, ArrowLeft, AlertCircle } from "lucide-react"

export default function TrackingPage() {
  const params = useParams()
  const router = useRouter()
  const trackingNumber = params.trackingNumber as string
  
  const [shipment, setShipment] = useState<Shipment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (trackingNumber) {
      fetchShipmentDetails()
    }
  }, [trackingNumber])

  const fetchShipmentDetails = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/shipments/${trackingNumber}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to fetch shipment details')
      }
      
      setShipment(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Fetching shipment details...</p>
              <p className="text-sm text-gray-500 mt-1">AWB: {trackingNumber}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <Button 
            onClick={() => router.push('/track')}
            variant="ghost"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tracking
          </Button>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                <span>Shipment Not Found</span>
              </CardTitle>
              <CardDescription>
                AWB: {trackingNumber}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700">{error}</p>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium mb-2">
                    Please check:
                  </p>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• The AWB number is correct</li>
                    <li>• The shipment has been booked</li>
                    <li>• There are no extra spaces or characters</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 font-medium mb-2">
                    Try these demo AWB numbers:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["AWB123456789", "AWB987654321", "AWB555666777"].map((awb) => (
                      <Button
                        key={awb}
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/track/${awb}`)}
                      >
                        {awb}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button onClick={() => router.push('/track')} variant="outline">
                    Try Another AWB
                  </Button>
                  <Button onClick={() => router.push('/contact')}>
                    Contact Support
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6">
          <Button 
            onClick={() => router.push('/track')}
            variant="ghost"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tracking
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Tracking Details
              </h1>
              <p className="text-gray-600">
                Real-time updates for your shipment
              </p>
            </div>
            <Button 
              onClick={fetchShipmentDetails}
              variant="outline"
              size="sm"
            >
              Refresh
            </Button>
          </div>
        </div>
        
        {shipment && <ShipmentDetails shipment={shipment} />}
      </div>
    </div>
  )
}