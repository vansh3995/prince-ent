import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    
    // Fetch notifications with more detailed information
    const notifications = await db.collection("notifications")
      .find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray()
      
    const unreadCount = await db.collection("notifications")
      .countDocuments({ read: false })

    // If no notifications exist, create some sample ones
    if (notifications.length === 0) {
      const sampleNotifications = [
        {
          type: "booking",
          message: "New booking request from Mumbai to Delhi",
          read: false,
          createdAt: new Date(),
          bookingId: "sample-booking-1",
          userId: "sample-user-1"
        },
        {
          type: "quote",
          message: "Quote request for electronics shipment",
          read: false,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          bookingId: "sample-quote-1",
          userId: "sample-user-2"
        },
        {
          type: "payment",
          message: "Payment received for booking #BK001",
          read: true,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          bookingId: "sample-booking-2",
          userId: "sample-user-3"
        },
        {
          type: "system",
          message: "System maintenance completed successfully",
          read: true,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        }
      ]

      await db.collection("notifications").insertMany(sampleNotifications)
      
      return NextResponse.json({
        success: true,
        notifications: sampleNotifications,
        unreadCount: sampleNotifications.filter(n => !n.read).length
      })
    }
    
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

// POST method to create new notifications
export async function POST(request: Request) {
  try {
    const { type, message, bookingId, userId } = await request.json()
    const { db } = await connectToDatabase()
    
    const notification = {
      type,
      message,
      read: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...(bookingId && { bookingId }),
      ...(userId && { userId })
    }
    
    const result = await db.collection("notifications").insertOne(notification)
    
    return NextResponse.json({
      success: true,
      notification: { ...notification, _id: result.insertedId }
    })
    
  } catch (error) {
    console.error('Create notification error:', error)
    return NextResponse.json(
      { success: false, message: "Failed to create notification" },
      { status: 500 }
    )
  }
}

// DELETE method to remove notifications
export async function DELETE(request: Request) {
  try {
    const { notificationId, deleteAll } = await request.json()
    const { db } = await connectToDatabase()
    
    if (deleteAll) {
      await db.collection("notifications").deleteMany({})
    } else if (notificationId) {
      await db.collection("notifications").deleteOne({
        _id: new ObjectId(notificationId)
      })
    }
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('Delete notification error:', error)
    return NextResponse.json(
      { success: false, message: "Failed to delete notification" },
      { status: 500 }
    )
  }
}