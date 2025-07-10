import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { sendEmail } from "@/lib/email"
import { verifyToken } from "@/lib/auth"

// Validation function
function validateBookingData(data: any) {
  const errors: string[] = []
  
  if (!data.customerName?.trim()) errors.push("Customer name is required")
  if (!data.customerEmail?.trim()) errors.push("Customer email is required")
  if (!data.customerPhone?.trim()) errors.push("Customer phone is required")
  if (!data.from?.trim()) errors.push("Origin city is required")
  if (!data.to?.trim()) errors.push("Destination city is required")
  if (!data.packageType) errors.push("Package type is required")
  if (!data.weight || isNaN(Number(data.weight)) || Number(data.weight) <= 0) {
    errors.push("Valid weight is required")
  }
  if (!data.pickupDate) errors.push("Pickup date is required")
  if (!data.pickupAddress?.trim()) errors.push("Pickup address is required")
  if (!data.deliveryAddress?.trim()) errors.push("Delivery address is required")
  
  return errors
}

export async function POST(request: NextRequest) {
  try {
    // JWT Authentication
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null
    
    let user = null
    if (token) {
      try {
        user = verifyToken(token)
      } catch (error) {
        console.log("Token verification failed, proceeding without user")
      }
    }

    const data = await request.json()
    
    // Validate data
    const validationErrors = validateBookingData(data)
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { success: false, message: validationErrors.join(", ") },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    
    // Generate unique AWB number starting with AV + 8 random digits
    const randomDigits = () => {
      let digits = ''
      for (let i = 0; i < 8; i++) {
        digits += Math.floor(Math.random() * 10).toString()
      }
      return digits
    }
    const awb = `AV${randomDigits()}`
    
    // Calculate estimated cost
    const calculateCost = (weight: number, serviceType: string) => {
      const baseRate = 50
      const weightRate = weight * 10
      const serviceMultiplier = serviceType === 'express' ? 1.5 : serviceType === 'overnight' ? 2 : 1
      return Math.round((baseRate + weightRate) * serviceMultiplier)
    }
    
    const estimatedCost = calculateCost(Number(data.weight), data.serviceType || 'standard')
    
    const booking = {
      ...data,
      userId: user?.id || null, // Store user ID if authenticated
      awb,
      bookingId: awb,
      status: 'confirmed',
      estimatedCost,
      createdAt: new Date(),
      updatedAt: new Date(),
      // Structured pickup details
      pickup: {
        name: data.customerName,
        phone: data.customerPhone,
        email: data.customerEmail,
        address: data.pickupAddress,
        city: data.from,
        date: data.pickupDate
      },
      // Structured delivery details
      delivery: {
        address: data.deliveryAddress,
        city: data.to
      }
    }
    
    const result = await db.collection("bookings").insertOne(booking)

    // Create notification for admin
    await db.collection("notifications").insertOne({
      type: "booking",
      title: "New Booking Created",
      message: `New booking from ${booking.customerName}`,
      bookingId: awb,
      awb: awb,
      userId: user?.id || null,
      createdAt: new Date(),
      read: false,
    })

    // Create shipment tracking entry
    await db.collection("shipments").insertOne({
      awb,
      bookingId: awb,
      origin: data.from,
      destination: data.to,
      currentStatus: 'Booked',
      statusHistory: [{
        status: 'Booked',
        location: data.from,
        timestamp: new Date(),
        description: 'Package booked successfully'
      }],
      customerDetails: {
        name: data.customerName,
        phone: data.customerPhone,
        email: data.customerEmail
      },
      createdAt: new Date(),
      updatedAt: new Date()
    })

    // Send booking confirmation email
    if (data.customerEmail) {
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1f2937;">Booking Confirmation - Prince Enterprises</h1>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #059669;">Booking Confirmed!</h2>
            <p><strong>AWB Number:</strong> ${awb}</p>
            <p><strong>From:</strong> ${data.from} → <strong>To:</strong> ${data.to}</p>
            <p><strong>Package Type:</strong> ${data.packageType}</p>
            <p><strong>Weight:</strong> ${data.weight} kg</p>
            <p><strong>Service Type:</strong> ${data.serviceType || 'standard'}</p>
            <p><strong>Estimated Cost:</strong> ₹${estimatedCost.toLocaleString()}</p>
            <p><strong>Pickup Date:</strong> ${new Date(data.pickupDate).toLocaleDateString()}</p>
          </div>
          <p>Thank you for choosing Prince Enterprises. We will contact you soon to confirm pickup details.</p>
          <p>You can track your shipment using AWB number: <strong>${awb}</strong></p>
          <hr style="margin: 30px 0;">
          <p style="color: #6b7280; font-size: 14px;">
            Prince Enterprises<br>
            Email: info@princeenterprises.com<br>
            Phone: +91 9876543210
          </p>
        </div>
      `
      
      try {
        await sendEmail(data.customerEmail, "Booking Confirmation - Prince Enterprises", emailHtml)
      } catch (emailError) {
        console.error('Email sending failed:', emailError)
        // Don't fail the booking if email fails
      }
    }

    return NextResponse.json({
      success: true,
      bookingId: awb,
      awb,
      estimatedCost,
      id: result.insertedId,
      message: "Booking created successfully"
    })

  } catch (error) {
    console.error('Booking creation error:', error)
    return NextResponse.json(
      { success: false, message: "Failed to create booking" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // JWT Authentication for user-specific bookings
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null
    
    let user = null
    if (token) {
      try {
        user = verifyToken(token)
      } catch (error) {
        return NextResponse.json(
          { success: false, message: "Invalid token" },
          { status: 401 }
        )
      }
    }

    const { db } = await connectToDatabase()
    const url = new URL(request.url)
    
    const page = parseInt(url.searchParams.get("page") || "1")
    const limit = parseInt(url.searchParams.get("limit") || "10")
    const skip = (page - 1) * limit
    
    // Build query
    const query: any = {}
    
    // If user is authenticated, show only their bookings
    if (user) {
      query.userId = user.id
    }
    
    // Admin can see all bookings by not passing userId
    const requestedUserId = url.searchParams.get("userId")
    if (requestedUserId && !user) {
      // If userId requested but no auth, return error
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      )
    }
    
    const bookings = await db.collection("bookings")
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()
      
    const total = await db.collection("bookings").countDocuments(query)
    
    return NextResponse.json({
      success: true,
      bookings,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    })
    
  } catch (error) {
    console.error('Fetch bookings error:', error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch bookings" },
      { status: 500 }
    )
  }
}
