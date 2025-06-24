import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email and password are required" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long" },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    
    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email })
    
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists with this email" },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const result = await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      role: "user",
      createdAt: new Date()
    })

    const userResponse = {
      id: result.insertedId,
      name,
      email,
      role: "user"
    }

    // Create a simple token (you might want to use JWT here)
    const token = Buffer.from(`${result.insertedId}:${email}`).toString('base64')

    return NextResponse.json({
      message: "Registration successful",
      token,
      user: userResponse
    })

  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
