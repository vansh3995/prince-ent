import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { db } = await connectToDatabase()
    await db.collection("quotes").insertOne({
      ...data,
      createdAt: new Date(),
    })
    await db.collection("notifications").insertOne({
      type: "quote",
      message: `New quote request from ${data.firstName || "User"}`,
      createdAt: new Date(),
      read: false,
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const quotes = await db.collection("quotes").find({}).sort({ createdAt: -1 }).toArray()
    return NextResponse.json({ success: true, quotes })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
  }
}