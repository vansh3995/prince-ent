import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { db } = await connectToDatabase()
    
    // Generate unique AWB number
    const timestamp = Date.now()
    const random = Math.random().toString(36).substr(2, 4).toUpperCase()
    const awb = `PE${timestamp}${random}`
    
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
