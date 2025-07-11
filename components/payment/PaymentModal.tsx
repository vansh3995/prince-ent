"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, AlertCircle, CheckCircle, X, Shield } from "lucide-react"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (paymentData: any) => void
  amount: number
  bookingId: string
  customerInfo: {
    name: string
    email: string
    phone: string
  }
}

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function PaymentModal({
  isOpen,
  onClose,
  onSuccess,
  amount,
  bookingId,
  customerInfo
}: PaymentModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpay = () => {
      if (typeof window !== 'undefined' && !window.Razorpay) {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.async = true
        script.onload = () => {
          console.log("Razorpay script loaded successfully")
          setRazorpayLoaded(true)
        }
        script.onerror = () => {
          console.error("Failed to load Razorpay script")
          setError("Failed to load payment gateway")
        }
        document.body.appendChild(script)
      } else if (window.Razorpay) {
        setRazorpayLoaded(true)
      }
    }

    if (isOpen) {
      loadRazorpay()
    }
  }, [isOpen])

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      setError("Payment gateway not loaded. Please try again.")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      console.log("Creating payment order for amount:", amount)
      
      // Create order
      const orderResponse = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency: 'INR',
          receipt: `booking_${bookingId}`,
          notes: {
            booking_id: bookingId,
            customer_name: customerInfo.name,
            customer_email: customerInfo.email
          }
        })
      })

      const orderData = await orderResponse.json()
      console.log("Order creation response:", orderData)

      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create order')
      }

      // Configure Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_1234567890',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Prince Enterprises',
        description: `Booking Payment - ${bookingId}`,
        image: '/logo.png',
        order_id: orderData.orderId,
        handler: async (response: any) => {
          console.log("Payment response received:", response)
          
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                booking_id: bookingId
              })
            })

            const verifyData = await verifyResponse.json()
            console.log("Payment verification response:", verifyData)

            if (verifyData.success) {
              onSuccess({
                payment_id: response.razorpay_payment_id,
                order_id: response.razorpay_order_id,
                amount: amount,
                booking_id: bookingId
              })
              onClose()
            } else {
              throw new Error(verifyData.error || 'Payment verification failed')
            }
          } catch (verifyError: any) {
            console.error("Payment verification error:", verifyError)
            setError(verifyError.message || 'Payment verification failed')
          }
        },
        prefill: {
          name: customerInfo.name,
          email: customerInfo.email,
          contact: customerInfo.phone
        },
        notes: {
          booking_id: bookingId,
          customer_name: customerInfo.name
        },
        theme: {
          color: '#dc2626'
        },
        modal: {
          ondismiss: () => {
            console.log("Payment modal dismissed")
            setIsLoading(false)
          }
        }
      }

      console.log("Opening Razorpay checkout with options:", options)
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error: any) {
      console.error("Payment initiation error:", error)
      setError(error.message || 'Payment failed to initialize')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <Card className="border-0 shadow-none">
          <CardHeader className="relative">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <span>Complete Payment</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Payment Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Booking ID:</span>
                <span className="text-sm font-mono">{bookingId}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Customer:</span>
                <span className="text-sm">{customerInfo.name}</span>
              </div>
              <div className="flex justify-between items-center border-t pt-2">
                <span className="font-medium">Total Amount:</span>
                <span className="text-xl font-bold text-green-600">
                  ₹{amount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center space-x-2 text-blue-700">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">Secure Payment</span>
              </div>
              <p className="text-xs text-blue-600 mt-1">
                Powered by Razorpay with 256-bit SSL encryption
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                <div className="flex items-center space-x-2 text-red-700">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Payment Error</span>
                </div>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            )}

            {/* Payment Methods */}
            <div className="space-y-3">
              <p className="text-sm font-medium">We Accept:</p>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Credit/Debit Cards</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Net Banking</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>UPI</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Digital Wallets</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePayment}
                disabled={isLoading || !razorpayLoaded}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4" />
                    <span>Pay ₹{amount.toLocaleString()}</span>
                  </div>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}