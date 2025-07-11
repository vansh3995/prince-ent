import { NextRequest, NextResponse } from "next/server"
import Razorpay from "razorpay"

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_1234567890",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "your_secret_here"
})

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = "INR", receipt, notes } = await request.json()

    console.log("Creating order with params:", { amount, currency, receipt, notes })

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Amount is required and must be greater than 0" },
        { status: 400 }
      )
    }

    // For demo purposes, we will simulate order creation
    // In production, use actual Razorpay API
    const mockOrder = {
      id: `order_${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
      entity: "order",
      amount: amount * 100, // Convert to paise
      amount_paid: 0,
      amount_due: amount * 100,
      currency: currency,
      receipt: receipt || `receipt_${Date.now()}`,
      offer_id: null,
      status: "created",
      attempts: 0,
      notes: notes || {},
      created_at: Math.floor(Date.now() / 1000)
    }

    console.log("Mock order created:", mockOrder)

    return NextResponse.json({
      success: true,
      orderId: mockOrder.id,
      amount: mockOrder.amount,
      currency: mockOrder.currency,
      receipt: mockOrder.receipt,
      status: mockOrder.status
    })
  } catch (error: any) {
    console.error("Order creation error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create payment order" },
      { status: 500 }
    )
  }
}