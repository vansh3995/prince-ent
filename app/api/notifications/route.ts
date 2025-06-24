import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    
    const notifications = await db.collection("notifications")
      .find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray()
      
    const unreadCount = await db.collection("notifications")
      .countDocuments({ read: false })
    
    return NextResponse.json({
      success: true,
      notifications,
      unreadCount
    })
    
  } catch (error) {
    console.error('Fetch notifications error:', error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch notifications" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const { notificationId, markAllRead } = await request.json()
    const { db } = await connectToDatabase()
    
    if (markAllRead) {
      await db.collection("notifications").updateMany(
        { read: false },
        { $set: { read: true, updatedAt: new Date() } }
      )
    } else if (notificationId) {
      await db.collection("notifications").updateOne(
        { _id: new ObjectId(notificationId) },
        { $set: { read: true, updatedAt: new Date() } }
      )
    }
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('Update notification error:', error)
    return NextResponse.json(
      { success: false, message: "Failed to update notification" },
      { status: 500 }
    )
  }
}