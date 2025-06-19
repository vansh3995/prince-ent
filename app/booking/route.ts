import { NextResponse } from "next/server"
import { connectToDatabase } from "../../lib/mongodb" // updated path, adjust if needed

export async function POST(request: Request) {
  const data = await request.json()
  const { db } = await connectToDatabase()
  const result = await db.collection("bookings").insertOne(data)
  return NextResponse.json({ success: true, id: result.insertedId })
}