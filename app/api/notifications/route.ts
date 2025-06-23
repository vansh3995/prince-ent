import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  const { db } = await connectToDatabase()
  const notifications = await db.collection("notifications").find({}).sort({ createdAt: -1 }).limit(20).toArray()
  return NextResponse.json({ notifications })
}

export async function PATCH(request: Request) {
  const { db } = await connectToDatabase()
  await db.collection("notifications").updateMany({ read: false }, { $set: { read: true } })
  return NextResponse.json({ success: true })
}