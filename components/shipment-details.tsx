"use client"

import { Shipment } from "@/types/shipment"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Package, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Truck, 
  AlertTriangle,
  User,
  Phone,
  Mail,
  Calendar,
  Scale,
  Ruler,
  DollarSign
} from "lucide-react"

interface ShipmentDetailsProps {
  shipment: Shipment
}

export default function ShipmentDetails({ shipment }: ShipmentDetailsProps) {
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "in transit":
        return <Truck className="w-5 h-5 text-blue-600" />
      case "picked up":
        return <Package className="w-5 h-5 text-yellow-600" />
      case "out for delivery":
        return <Truck className="w-5 h-5 text-purple-600" />
      case "exception":
        return <AlertTriangle className="w-5 h-5 text-red-600" />
      default:
        return <Clock className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "in transit":
        return "bg-blue-100 text-blue-800"
      case "picked up":
        return "bg-yellow-100 text-yellow-800"
      case "out for delivery":
        return "bg-purple-100 text-purple-800"
      case "exception":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getProgressPercentage = (status: string) => {
    switch (status.toLowerCase()) {
      case "booked":
        return 10
      case "picked up":
        return 25
      case "in transit":
        return 60
      case "out for delivery":
        return 85
      case "delivered":
        return 100
      case "exception":
        return 50
      default:
        return 0
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const progressPercentage = getProgressPercentage(shipment.status)

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">
                Shipment Details
              </CardTitle>
              <CardDescription>
                AWB: {shipment.awbNumber}
              </CardDescription>
            </div>
            <Badge className={getStatusColor(shipment.status)}>
              <div className="flex items-center space-x-1">
                {getStatusIcon(shipment.status)}
                <span>{shipment.status}</span>
              </div>
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`progress-bar rounded-full transition-all duration-300 ${
                  shipment.status === 'Exception' ? 'progress-bar-error' : 'progress-bar-info'
                }`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Key Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Current Location</p>
              <p className="font-medium">{shipment.currentLocation}</p>
            </div>
            <div>
              <p className="text-gray-600">Service Type</p>
              <p className="font-medium">{shipment.serviceType}</p>
            </div>
            <div>
              <p className="text-gray-600">Estimated Delivery</p>
              <p className="font-medium">{formatDate(shipment.estimatedDelivery)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Journey Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>Journey Map</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Origin */}
            <div className="flex items-start space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full mt-2" />
              <div>
                <p className="font-medium text-green-700">Origin</p>
                <p className="text-sm text-gray-600">
                  {shipment.origin.address}, {shipment.origin.city}, {shipment.origin.state} - {shipment.origin.pincode}
                </p>
              </div>
            </div>

            {/* Current Location */}
            <div className="flex items-start space-x-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full mt-2" />
              <div>
                <p className="font-medium text-blue-700">Current Location</p>
                <p className="text-sm text-gray-600">{shipment.currentLocation}</p>
              </div>
            </div>

            {/* Destination */}
            <div className="flex items-start space-x-3">
              <div className={`w-3 h-3 rounded-full mt-2 ${
                shipment.status === 'Delivered' ? 'bg-green-500' : 'bg-gray-300'
              }`} />
              <div>
                <p className={`font-medium ${
                  shipment.status === 'Delivered' ? 'text-green-700' : 'text-gray-700'
                }`}>
                  Destination
                </p>
                <p className="text-sm text-gray-600">
                  {shipment.destination.address}, {shipment.destination.city}, {shipment.destination.state} - {shipment.destination.pincode}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Shipment History</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {shipment.history.map((event, index) => (
              <div key={event.id} className="flex items-start space-x-3 pb-4 border-b last:border-b-0">
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(event.status)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{event.status}</p>
                    <p className="text-sm text-gray-500">{formatDate(event.timestamp)}</p>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span>{event.location}</span>
                    {event.updatedBy && (
                      <>
                        <span className="mx-2">•</span>
                        <span>{event.updatedBy}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Package Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="w-5 h-5" />
              <span>Package Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-2">
              <Scale className="w-4 h-4 text-gray-500" />
              <span className="text-sm">Weight: {shipment.packageDetails.weight} kg</span>
            </div>
            <div className="flex items-center space-x-2">
              <Ruler className="w-4 h-4 text-gray-500" />
              <span className="text-sm">
                Dimensions: {shipment.packageDetails.dimensions.length} x {shipment.packageDetails.dimensions.width} x {shipment.packageDetails.dimensions.height} cm
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Type</p>
              <p className="font-medium">{shipment.packageDetails.packageType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Description</p>
              <p className="font-medium">{shipment.packageDetails.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-gray-500" />
              <span className="text-sm">Value: ₹{shipment.packageDetails.value}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Contact Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 font-medium">Sender</p>
              <p className="font-medium">{shipment.sender.name}</p>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="w-3 h-3" />
                <span>{shipment.sender.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="w-3 h-3" />
                <span>{shipment.sender.email}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Receiver</p>
              <p className="font-medium">{shipment.receiver.name}</p>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="w-3 h-3" />
                <span>{shipment.receiver.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="w-3 h-3" />
                <span>{shipment.receiver.email}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Billing Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5" />
            <span>Billing Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Shipping Charges</span>
              <span>₹{shipment.charges.shippingCharges}</span>
            </div>
            <div className="flex justify-between">
              <span>Fuel Surcharge</span>
              <span>₹{shipment.charges.fuelSurcharge}</span>
            </div>
            <div className="flex justify-between">
              <span>Service Tax</span>
              <span>₹{shipment.charges.serviceTax}</span>
            </div>
            <div className="flex justify-between font-medium text-lg border-t pt-2">
              <span>Total</span>
              <span>₹{shipment.charges.total}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Status</span>
              <Badge variant={shipment.paymentStatus === 'Paid' ? 'default' : 'secondary'}>
                {shipment.paymentStatus}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}