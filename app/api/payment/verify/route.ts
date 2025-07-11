import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      booking_id 
    } = await request.json()

    console.log("Verifying payment:", {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      booking_id
    })

    // For demo purposes, we will simulate payment verification
    // In production, verify the signature using your Razorpay secret
    const keySecret = process.env.RAZORPAY_KEY_SECRET || "your_secret_here"
    
    if (keySecret === "your_secret_here") {
      // Demo mode - always verify as successful
      console.log("Demo mode: Payment verification successful")
      
      // Here you would typically:
      // 1. Update booking status in database
      // 2. Send confirmation email
      // 3. Update payment records
      
      return NextResponse.json({
        success: true,
        message: "Payment verified successfully",
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        bookingId: booking_id
      })
    }

    // Production verification
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body.toString())
      .digest("hex")

    const isAuthentic = expectedSignature === razorpay_signature

    if (isAuthentic) {
      console.log("Payment verification successful")
      
      // Here you would typically:
      // 1. Update booking status in database
      // 2. Send confirmation email
      // 3. Update payment records
      
      return NextResponse.json({
        success: true,
        message: "Payment verified successfully",
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        bookingId: booking_id
      })
    } else {
      console.log("Payment verification failed - Invalid signature")
      return NextResponse.json(
        { success: false, error: "Invalid payment signature" },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error("Payment verification error:", error)
    return NextResponse.json(
      { success: false, error: "Payment verification failed" },
      { status: 500 }
    )
  }
}