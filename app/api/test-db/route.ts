import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    
    // Test the connection by pinging the database
    await db.admin().ping()
    
    return NextResponse.json({
      message: "Database connection successful",
      status: "connected",
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("Database connection error:", error)
    return NextResponse.json(
      { 
        message: "Database connection failed",
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
