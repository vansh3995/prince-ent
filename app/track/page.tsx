"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle, Clock, MapPin, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import TrackingForm from "@/components/tracking-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

// Mock data for shipment tracking
const mockShipments = [
  {
    id: "PE123456789",
    status: "delivered",
    customer: "Raj Kumar",
    origin: "Delhi",
    destination: "Mumbai",
    service: "Express Delivery",
    weight: "5.2 kg",
    date: "2024-06-10",
    estimatedDelivery: "2024-06-12",
    actualDelivery: "2024-06-12",
    history: [
      {
        date: "2024-06-10 09:15 AM",
        location: "Delhi Hub",
        status: "Shipment picked up",
        description: "Package collected from sender",
      },
      {
        date: "2024-06-10 02:30 PM",
        location: "Delhi Hub",
        status: "Shipment processed",
        description: "Package sorted and prepared for dispatch",
      },
      {
        date: "2024-06-10 07:45 PM",
        location: "Delhi Hub",
        status: "In transit",
        description: "Package departed from origin facility",
      },
      {
        date: "2024-06-11 10:20 AM",
        location: "Jaipur Hub",
        status: "In transit",
        description: "Package arrived at intermediate facility",
      },
      {
        date: "2024-06-11 03:40 PM",
        location: "Jaipur Hub",
        status: "In transit",
        description: "Package departed from intermediate facility",
      },
      {
        date: "2024-06-12 08:10 AM",
        location: "Mumbai Hub",
        status: "Out for delivery",
        description: "Package out for delivery",
      },
      {
        date: "2024-06-12 02:35 PM",
        location: "Mumbai",
        status: "Delivered",
        description: "Package delivered successfully",
      },
    ],
  },
  {
    id: "PE987654321",
    status: "in-transit",
    customer: "Priya Sharma",
    origin: "Bangalore",
    destination: "Chennai",
    service: "Standard Delivery",
    weight: "3.7 kg",
    date: "2024-06-11",
    estimatedDelivery: "2024-06-14",
    history: [
      {
        date: "2024-06-11 10:30 AM",
        location: "Bangalore Hub",
        status: "Shipment picked up",
        description: "Package collected from sender",
      },
      {
        date: "2024-06-11 04:15 PM",
        location: "Bangalore Hub",
        status: "Shipment processed",
        description: "Package sorted and prepared for dispatch",
      },
      {
        date: "2024-06-12 08:20 AM",
        location: "Bangalore Hub",
        status: "In transit",
        description: "Package departed from origin facility",
      },
      {
        date: "2024-06-12 03:45 PM",
        location: "Hosur Hub",
        status: "In transit",
        description: "Package arrived at intermediate facility",
      },
    ],
  },
]

export default function TrackPage() {
  const searchParams = useSearchParams()
  const trackingId = searchParams.get("id")
  const [shipment, setShipment] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (trackingId) {
      setLoading(true)
      setError("")

      // Simulate API call with timeout
      setTimeout(() => {
        const found = mockShipments.find((s) => s.id === trackingId)
        if (found) {
          setShipment(found)
        } else {
          setError("No shipment found with the provided tracking number. Please check and try again.")
        }
        setLoading(false)
      }, 1000)
    }
  }, [trackingId])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "text-green-600"
      case "in transit":
        return "text-blue-600"
      case "out for delivery":
        return "text-purple-600"
      default:
        return "text-gray-600"
    }
  }

  const getProgressValue = (shipment: any) => {
    if (!shipment) return 0
    if (shipment.status === "delivered") return 100

    const totalSteps = 5 // pickup, processing, in transit, out for delivery, delivered
    let currentStep = 0

    const lastStatus = shipment.history[shipment.history.length - 1].status.toLowerCase()

    if (lastStatus.includes("picked up")) currentStep = 1
    else if (lastStatus.includes("processed")) currentStep = 2
    else if (lastStatus.includes("transit")) currentStep = 3
    else if (lastStatus.includes("out for delivery")) currentStep = 4
    else if (lastStatus.includes("delivered")) currentStep = 5

    return (currentStep / totalSteps) * 100
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Track Your Shipment</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Enter Tracking Number</CardTitle>
            <CardDescription>Enter your tracking number to get real-time updates on your shipment</CardDescription>
          </CardHeader>
          <CardContent>
            <TrackingForm className="max-w-md" />
          </CardContent>
        </Card>

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Searching for your shipment...</p>
          </div>
        )}

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-red-600 mb-2">
                <AlertCircle className="h-5 w-5" />
                <h3 className="font-semibold">Shipment Not Found</h3>
              </div>
              <p>{error}</p>
            </CardContent>
          </Card>
        )}

        {!loading && shipment && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">Tracking Number: {shipment.id}</CardTitle>
                    <CardDescription>
                      {shipment.service} • {shipment.weight}
                    </CardDescription>
                  </div>
                  <div
                    className={`font-semibold ${getStatusColor(shipment.history[shipment.history.length - 1].status)}`}
                  >
                    {shipment.history[shipment.history.length - 1].status}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <Progress value={getProgressValue(shipment)} className="h-2" />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-500 mb-1">Origin</h3>
                    <p className="font-semibold">{shipment.origin}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-500 mb-1">Destination</h3>
                    <p className="font-semibold">{shipment.destination}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-500 mb-1">Shipping Date</h3>
                    <p className="font-semibold">{new Date(shipment.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-500 mb-1">
                      {shipment.status === "delivered" ? "Delivered On" : "Estimated Delivery"}
                    </h3>
                    <p className="font-semibold">
                      {shipment.status === "delivered"
                        ? new Date(shipment.actualDelivery).toLocaleDateString()
                        : new Date(shipment.estimatedDelivery).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="history">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="history">Tracking History</TabsTrigger>
                <TabsTrigger value="details">Shipment Details</TabsTrigger>
              </TabsList>

              <TabsContent value="history" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      {shipment.history.map((event: any, index: number) => (
                        <div key={index} className="relative pl-8 pb-6">
                          {index < shipment.history.length - 1 && (
                            <div className="absolute left-[15px] top-[24px] bottom-0 w-[1px] bg-gray-300"></div>
                          )}
                          <div
                            className={`absolute left-0 top-0 rounded-full p-1 ${
                              index === 0 ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {index === 0 ? <CheckCircle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                          </div>
                          <div>
                            <p className="font-semibold">{event.status}</p>
                            <p className="text-sm text-gray-600">{event.date}</p>
                            <div className="mt-1 flex items-start gap-1 text-gray-600">
                              <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                              <span>{event.location}</span>
                            </div>
                            <p className="mt-1 text-gray-600">{event.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-medium text-gray-500 mb-1">Customer</h3>
                        <p className="font-semibold">{shipment.customer}</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-500 mb-1">Service Type</h3>
                        <p className="font-semibold">{shipment.service}</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-500 mb-1">Weight</h3>
                        <p className="font-semibold">{shipment.weight}</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-500 mb-1">Current Location</h3>
                        <p className="font-semibold">{shipment.history[shipment.history.length - 1].location}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-center">
              <Button className="bg-red-600 hover:bg-red-700" onClick={() => window.print()}>
                Print Tracking Details
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
