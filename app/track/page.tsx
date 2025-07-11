import type { Metadata } from "next"
import TrackingForm from "@/components/tracking-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Search, Clock, MapPin, Truck } from "lucide-react"

export const metadata: Metadata = {
  title: "Track Package - Prince Enterprises",
  description: "Track your shipment with real-time updates",
}

export default function TrackPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Package</h1>
          <p className="text-gray-600">
            Enter your AWB number to get real-time updates on your shipment
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="w-5 h-5" />
                  <span>Enter Tracking Details</span>
                </CardTitle>
                <CardDescription>
                  Track your shipment using AWB number
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TrackingForm />
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="w-5 h-5" />
                  <span>Tracking Features</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Real-time Updates</p>
                    <p className="text-sm text-gray-600">Get live status updates</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium">Location Tracking</p>
                    <p className="text-sm text-gray-600">Track current location</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Truck className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Delivery Updates</p>
                    <p className="text-sm text-gray-600">Estimated delivery time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Can't find your AWB number or facing issues with tracking?
                </p>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Call:</span> +91 9876543210
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Email:</span> support@princeenterprises.com
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Hours:</span> 9:00 AM - 6:00 PM
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}