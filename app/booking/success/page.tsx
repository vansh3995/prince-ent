"use client"

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Download, Package, CreditCard, Calendar, MapPin, Phone, Mail } from 'lucide-react'

interface BookingData {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  from: string
  to: string
  packageType: string
  weight: string
  serviceType: string
  estimatedCost: number
  paymentStatus: string
  paymentId?: string
  orderId?: string
  createdAt: string
  paidAt?: string
  status: string
  pickupDate: string
  pickupAddress: string
  deliveryAddress: string
  specialInstructions?: string
}

export default function BookingSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('id')
  
  const [bookingData, setBookingData] = useState<BookingData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (bookingId) {
      const data = localStorage.getItem(`booking_${bookingId}`)
      if (data) {
        try {
          const parsedData = JSON.parse(data)
          setBookingData(parsedData)
        } catch (error) {
          console.error("Error parsing booking data:", error)
        }
      }
    }
    setIsLoading(false)
  }, [bookingId])

  const downloadReceipt = () => {
    if (!bookingData) return

    const receiptContent = `
PRINCE ENTERPRISES
BOOKING RECEIPT
==========================================

Booking ID: ${bookingData.id}
Date: ${new Date(bookingData.createdAt).toLocaleDateString('en-IN')}
Time: ${new Date(bookingData.createdAt).toLocaleTimeString('en-IN')}

CUSTOMER DETAILS:
Name: ${bookingData.customerName}
Email: ${bookingData.customerEmail}
Phone: ${bookingData.customerPhone}

SHIPMENT DETAILS:
From: ${bookingData.from}
To: ${bookingData.to}
Package Type: ${bookingData.packageType}
Weight: ${bookingData.weight} kg
Service Type: ${bookingData.serviceType}
Pickup Date: ${new Date(bookingData.pickupDate).toLocaleDateString('en-IN')}

ADDRESSES:
Pickup Address: ${bookingData.pickupAddress}
Delivery Address: ${bookingData.deliveryAddress}
${bookingData.specialInstructions ? `Special Instructions: ${bookingData.specialInstructions}` : ''}

PAYMENT DETAILS:
Amount: ₹${bookingData.estimatedCost.toLocaleString()}
Payment Status: ${bookingData.paymentStatus}
${bookingData.paymentId ? `Payment ID: ${bookingData.paymentId}` : ''}
${bookingData.orderId ? `Order ID: ${bookingData.orderId}` : ''}
${bookingData.paidAt ? `Paid At: ${new Date(bookingData.paidAt).toLocaleString('en-IN')}` : ''}

STATUS: ${bookingData.status.toUpperCase()}

==========================================
Thank you for choosing Prince Enterprises!
For support, contact us at support@princeenterprises.com
==========================================
    `

    const blob = new Blob([receiptContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `receipt_${bookingData.id}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    )
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <p className="text-gray-600 mb-4">Booking not found</p>
            <Button onClick={() => router.push('/booking')}>
              Create New Booking
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 rounded-full p-3">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎉 Booking Confirmed!
          </h1>
          <p className="text-gray-600">
            Your shipment has been booked successfully and payment has been received.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-blue-600" />
                <span>Booking Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Booking ID</span>
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{bookingData.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Status</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✅ {bookingData.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">From</span>
                  <span className="text-gray-900">{bookingData.from}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">To</span>
                  <span className="text-gray-900">{bookingData.to}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Package Type</span>
                  <span className="text-gray-900 capitalize">{bookingData.packageType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Weight</span>
                  <span className="text-gray-900">{bookingData.weight} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Service</span>
                  <span className="text-gray-900 capitalize">{bookingData.serviceType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Pickup Date</span>
                  <span className="text-gray-900">
                    {new Date(bookingData.pickupDate).toLocaleDateString('en-IN')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-green-600" />
                <span>Payment Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Amount Paid</span>
                  <span className="text-xl font-bold text-green-600">
                    ₹{bookingData.estimatedCost.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Payment Status</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✅ {bookingData.paymentStatus}
                  </span>
                </div>
                {bookingData.paymentId && (
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Payment ID</span>
                    <span className="text-gray-900 font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                      {bookingData.paymentId}
                    </span>
                  </div>
                )}
                {bookingData.orderId && (
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Order ID</span>
                    <span className="text-gray-900 font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                      {bookingData.orderId}
                    </span>
                  </div>
                )}
                {bookingData.paidAt && (
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Paid At</span>
                    <span className="text-gray-900 text-sm">
                      {new Date(bookingData.paidAt).toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-gray-900">{bookingData.customerEmail}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Phone</p>
                  <p className="text-gray-900">{bookingData.customerPhone}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Booking Date</p>
                  <p className="text-gray-900">{new Date(bookingData.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Addresses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-orange-600" />
                <span>Pickup Address</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-900">{bookingData.pickupAddress}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-green-600" />
                <span>Delivery Address</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-900">{bookingData.deliveryAddress}</p>
            </CardContent>
          </Card>
        </div>

        {/* Special Instructions */}
        {bookingData.specialInstructions && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Special Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-900">{bookingData.specialInstructions}</p>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <Button
            onClick={downloadReceipt}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
          >
            <Download className="w-4 h-4" />
            <span>Download Receipt</span>
          </Button>
          <Button
            onClick={() => router.push(`/track?id=${bookingData.id}`)}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
          >
            <Package className="w-4 h-4" />
            <span>Track Shipment</span>
          </Button>
          <Button
            onClick={() => router.push('/booking')}
            variant="outline"
          >
            New Booking
          </Button>
          <Button
            onClick={() => router.push('/dashboard')}
            variant="outline"
          >
            Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}