import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { z } from "zod"

// Define your booking schema
const BookingSchema = z.object({
  serviceType: z.string(),
  packageType: z.string(),
  weight: z.string(),
  value: z.string(),
  dimensions: z.object({
    length: z.string(),
    width: z.string(),
    height: z.string(),
  }),
  description: z.string(),
  pickup: z.object({
    name: z.string(),
    phone: z.string(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    pincode: z.string(),
    email: z.string().email().optional(),
    date: z.string().optional(),
  }),
  delivery: z.object({
    name: z.string(),
    phone: z.string(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    pincode: z.string(),
    email: z.string().email().optional(),
    date: z.string().optional(),
  }),
})

export async function POST(request: Request) {
  try {
    const data = await request.json()
    // Validate and sanitize input
    const parsed = BookingSchema.safeParse(data)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Invalid data", errors: parsed.error.errors },
        { status: 400 }
      )
    }
    const { db } = await connectToDatabase()
    const bookingToSave = { ...parsed.data, status: "Pending" }
    const result = await db.collection("bookings").insertOne(bookingToSave)

    // Notify admin or relevant personnel about the new booking
    await db.collection("notifications").insertOne({
      type: "booking",
      message: `New booking from ${bookingToSave.pickup?.name || "User"}`,
      createdAt: new Date(),
      read: false,
    })

    return NextResponse.json({ success: true, id: result.insertedId })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Booking failed", error: error },
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
    const skip = (page - 1) * limit
    const bookings = await db.collection("bookings").find({})
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()
    const total = await db.collection("bookings").countDocuments()
    return NextResponse.json({ success: true, bookings, total })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch bookings", error },
      { status: 500 }
    )
  }
}
