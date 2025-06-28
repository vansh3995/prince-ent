import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    // Sample analytics data for admin dashboard
    const analytics = {
      dailyBookings: [
        { date: "2024-01-01", bookings: 45 },
        { date: "2024-01-02", bookings: 52 },
        { date: "2024-01-03", bookings: 38 },
        { date: "2024-01-04", bookings: 67 },
        { date: "2024-01-05", bookings: 71 },
        { date: "2024-01-06", bookings: 43 },
        { date: "2024-01-07", bookings: 56 }
      ],
      cityStats: [
        { city: "Mumbai", bookings: 234 },
        { city: "Delhi", bookings: 198 },
        { city: "Bangalore", bookings: 187 },
        { city: "Chennai", bookings: 156 },
        { city: "Kolkata", bookings: 134 }
      ],
      statusDistribution: [
        { name: "Delivered", value: 65 },
        { name: "In Transit", value: 20 },
        { name: "Pending", value: 10 },
        { name: "Cancelled", value: 5 }
      ],
      revenueData: [
        { month: "Jan", revenue: 125000 },
        { month: "Feb", revenue: 143000 },
        { month: "Mar", revenue: 167000 },
        { month: "Apr", revenue: 189000 },
        { month: "May", revenue: 201000 },
        { month: "Jun", revenue: 234000 }
      ]
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Admin Analytics API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}