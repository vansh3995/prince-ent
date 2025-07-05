import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    // Create user object (in production, save to database)
    const user = {
      id: Date.now().toString(),
      name,
      email,
      role: "user" as const,
    }

    // Generate simple token (in production, use proper JWT)
    const token = `token_${user.id}_${Date.now()}`

    return NextResponse.json({
      success: true,
      message: "Registration successful",
      user,
      token,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
