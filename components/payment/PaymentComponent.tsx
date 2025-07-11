"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, AlertCircle, CheckCircle } from "lucide-react"
import { RazorpayOptions, RazorpayResponse } from "@/types/razorpay"

interface PaymentProps {
  amount: number
  orderId?: string
  onSuccess?: (response: RazorpayResponse) => void
  onError?: (error: any) => void
  customerInfo?: {
    name: string
    email: string
    phone: string
  }
}

export default function PaymentComponent({ 
  amount, 
  orderId, 
  onSuccess, 
  onError, 
  customerInfo 
}: PaymentProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "failed">("idle")

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const createOrder = async () => {
    try {
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          currency: "INR",
          receipt: `receipt_${Date.now()}`,
          notes: {
            bookingId: orderId || "",
            customerEmail: customerInfo?.email || ""
          }
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to create order")
      }

      return data
    } catch (error: any) {
      console.error("Order creation error:", error)
      throw error
    }
  }

  const handlePayment = async () => {
    setIsLoading(true)
    setError("")
    setPaymentStatus("processing")

    try {
      // Load Razorpay script
      const res = await loadRazorpay()
      if (!res) {
        throw new Error("Failed to load Razorpay SDK")
      }

      // Create order
      const order = await createOrder()

      // Configure Razorpay options
      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_your_key_here",
        amount: order.amount,
        currency: order.currency,
        name: "Prince Enterprises",
        description: "Logistics Service Payment",
        image: "/logo.png",
        order_id: order.orderId,
        handler: async (response: RazorpayResponse) => {
          try {
            // Verify payment
            const verifyResponse = await fetch("/api/payment/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            })

            const verifyData = await verifyResponse.json()

            if (verifyResponse.ok && verifyData.success) {
              setPaymentStatus("success")
              onSuccess?.(response)
            } else {
              throw new Error("Payment verification failed")
            }
          } catch (error: any) {
            console.error("Payment verification error:", error)
            setPaymentStatus("failed")
            setError(error.message)
            onError?.(error)
          }
        },
        prefill: {
          name: customerInfo?.name || "",
          email: customerInfo?.email || "",
          contact: customerInfo?.phone || ""
        },
        notes: {
          address: "Prince Enterprises Office"
        },
        theme: {
          color: "#3B82F6"
        },
        modal: {
          ondismiss: () => {
            setPaymentStatus("idle")
            setIsLoading(false)
          }
        }
      }

      // Open Razorpay checkout
      const paymentObject = new window.Razorpay(options)
      paymentObject.open()
    } catch (error: any) {
      console.error("Payment error:", error)
      setError(error.message)
      setPaymentStatus("failed")
      onError?.(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="w-5 h-5" />
          <span>Payment</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            {error}
          </div>
        )}

        {paymentStatus === "success" && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded flex items-center">
            <CheckCircle className="w-4 h-4 mr-2" />
            Payment successful!
          </div>
        )}

        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">₹{amount.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Amount to pay</p>
        </div>

        <Button
          onClick={handlePayment}
          disabled={isLoading || paymentStatus === "success"}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Processing...</span>
            </div>
          ) : paymentStatus === "success" ? (
            "Payment Completed"
          ) : (
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4" />
              <span>Pay Now</span>
            </div>
          )}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          Powered by Razorpay  Secure payments
        </p>
      </CardContent>
    </Card>
  )
}