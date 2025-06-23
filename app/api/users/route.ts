import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  const { db } = await connectToDatabase()
  const users = await db.collection("users").find({}).toArray()
  return NextResponse.json({ users })
}