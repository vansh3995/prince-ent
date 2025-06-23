import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()
    const { status } = await request.json()
    await db.collection("bookings").updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { status } }
    )
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update status", error },
      { status: 500 }
    )
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()
    const booking = await db.collection("bookings").findOne({ _id: new ObjectId(params.id) })
    if (!booking) {
      return NextResponse.json({ success: false, message: "Not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true, booking })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch booking", error },
      { status: 500 }
    )
  }
}