import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { sendEmail } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { db } = await connectToDatabase()
    
    // Generate unique AWB number starting with AV + 8 random digits
    const randomDigits = () => {
      let digits = ''
      for (let i = 0; i < 8; i++) {
        digits += Math.floor(Math.random() * 10).toString()
      }
      return digits
    }
    const awb = `AV${randomDigits()}`
    
    const booking = {
      ...data,
      awb,
      bookingId: awb,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await db.collection("bookings").insertOne(booking)

    // Create notification for admin
    await db.collection("notifications").insertOne({
      type: "booking",
      title: "New Booking Created",
      message: `New booking from ${booking.pickup?.name || "User"}`,
      bookingId: awb,
      awb: awb,
      createdAt: new Date(),
      read: false,
    })

    // Send booking confirmation email
    if (booking.email) {
      const emailHtml = `
        <h1>Booking Confirmation</h1>
        <p>Thank you for your booking. Your AWB number is <strong>${awb}</strong>.</p>
        <p>We will keep you updated on the status of your shipment.</p>
      `
      await sendEmail(booking.email, "Booking Confirmation - Prince Enterprises", emailHtml)
    }

    return NextResponse.json({
      success: true,
      bookingId: awb,
      awb,
      id: result.insertedId
    })

  } catch (error) {
    console.error('Booking creation error:', error)
    return NextResponse.json(
      { success: false, message: "Failed to create booking" },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const url = new URL(request.url)
    
    const page = parseInt(url.searchParams.get("page") || "1")
    const limit = parseInt(url.searchParams.get("limit") || "10")
    const userId = url.searchParams.get("userId")
    const skip = (page - 1) * limit
    
    const query: any = {}
    if (userId) {
      query.userId = userId
    }
    
    const bookings = await db.collection("bookings")
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()
      
    const total = await db.collection("bookings").countDocuments(query)
    
    return NextResponse.json({
      success: true,
      bookings,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    })
    
  } catch (error) {
    console.error('Fetch bookings error:', error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch bookings" },
      { status: 500 }
    )
  }
}
