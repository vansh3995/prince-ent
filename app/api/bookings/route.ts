import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb" // Make sure path is correct

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { db } = await connectToDatabase()
    const result = await db.collection("bookings").insertOne(data)
    return NextResponse.json({ success: true, id: result.insertedId })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Booking failed", error: error },
      { status: 500 }
    )
  }
}

export function GET() {
  return NextResponse.json(
    { message: "This API only supports POST requests to create bookings." },
    { status: 405 }
  )
}
