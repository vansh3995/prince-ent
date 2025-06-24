import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    
    const users = await db.collection("users")
      .find({})
      .sort({ createdAt: -1 })
      .toArray()
    
    return NextResponse.json({
      success: true,
      users
    })
    
  } catch (error) {
    console.error('Fetch users error:', error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch users" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { email, role } = await request.json()
    const { db } = await connectToDatabase()
    
    // Create superadmin user
    const superAdmin = {
      email,
      name: "Super Admin",
      role: role || "superadmin",
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await db.collection("users").insertOne(superAdmin)
    
    return NextResponse.json({
      success: true,
      user: superAdmin,
      id: result.insertedId
    })
    
  } catch (error) {
    console.error('Create user error:', error)
    return NextResponse.json(
      { success: false, message: "Failed to create user" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const { userId, role } = await request.json()
    const { db } = await connectToDatabase()
    
    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          role,
          updatedAt: new Date()
        } 
      }
    )
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('Update user role error:', error)
    return NextResponse.json(
      { success: false, message: "Failed to update user role" },
      { status: 500 }
    )
  }
}