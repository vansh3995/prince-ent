import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { db } = await connectToDatabase()
  const { role } = await request.json()
  await db.collection("users").updateOne(
    { _id: new ObjectId(params.id) },
    { $set: { role } }
  )
  return NextResponse.json({ success: true })
}