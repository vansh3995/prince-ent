import { NextRequest, NextResponse } from "next/server"
import Razorpay from "razorpay"

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_your_key_here",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "your_secret_here"
})

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = "INR", receipt, notes } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Amount is required and must be greater than 0" },
        { status: 400 }
      )
    }

    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes: notes || {}
    })

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt
    })
  } catch (error: any) {
    console.error("Razorpay order creation error:", error)
    return NextResponse.json(
      { error: "Failed to create payment order" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get("orderId")

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      )
    }

    const order = await razorpay.orders.fetch(orderId)
    return NextResponse.json(order)
  } catch (error: any) {
    console.error("Razorpay order fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    )
  }
}