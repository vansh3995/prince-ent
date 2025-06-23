import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const bookings = await db.collection("bookings").find({}).toArray()

    // Total bookings
    const totalBookings = bookings.length

    // City-wise bookings
    const cityCount: Record<string, number> = {}
    bookings.forEach(b => {
      const city = b.pickup?.city || "Unknown"
      cityCount[city] = (cityCount[city] || 0) + 1
    })
    const cityData = Object.entries(cityCount).map(([city, count]) => ({ city, count }))

    // Monthly bookings
    const monthlyCount: Record<string, number> = {}
    bookings.forEach(b => {
      const date = b.createdAt ? new Date(b.createdAt) : null
      if (date) {
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
        monthlyCount[month] = (monthlyCount[month] || 0) + 1
      }
    })
    const monthlyData = Object.entries(monthlyCount)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => ({ month, count }))

    return NextResponse.json({ totalBookings, cityData, monthlyData })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}