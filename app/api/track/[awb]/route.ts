import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { sendEmail } from "@/lib/email";

// Add to your interfaces
export type TrackingStatus = 
  | "booked" 
  | "picked-up" 
  | "in-transit" 
  | "out-for-delivery" 
  | "delivered" 
  | "exception" 
  | "cancelled"

interface TrackingEvent {
  id: string;
  timestamp: string;
  status: TrackingStatus; // Use the type instead of string
  location: string;
  description: string;
}

interface BookingDocument {
  _id?: ObjectId;
  awb: string;
  status: string;
  events?: TrackingEvent[];
  // Add other booking fields as needed
  senderName?: string;
  receiverName?: string;
  weight?: number;
  email?: string;
  // ... other fields
}

export async function GET(req: Request, { params }: { params: { awb: string } }) {
  const { db } = await connectToDatabase();
  const parcel = await db.collection<BookingDocument>("bookings").findOne({ awb: params.awb });
  
  if (!parcel) {
    return NextResponse.json({ error: "Parcel not found" }, { status: 404 });
  }
  
  return NextResponse.json({ parcel });
}

export async function PATCH(request: Request, { params }: { params: { awb: string } }) {
  // Add authentication check
  const session = await getServerSession();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    const { status, location, description } = await request.json();
    
    // Add validation in PATCH method
    if (!status || !location || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!params.awb || params.awb.length < 5) {
      return NextResponse.json({ error: "Invalid AWB number" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    
    const trackingEvent: TrackingEvent = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      status,
      location,
      description
    };
    
    await db.collection<BookingDocument>("bookings").updateOne(
      { awb: params.awb },
      { 
        $set: { status },
        $push: { events: trackingEvent }
      }
    );

    // Send email notification on tracking update
    const updatedBooking = await db.collection<BookingDocument>("bookings").findOne({ awb: params.awb });
    if (updatedBooking?.email) {
      const emailHtml = `
        <h1>Tracking Update</h1>
        <p>Your shipment with AWB <strong>${params.awb}</strong> has a new status update:</p>
        <p>Status: <strong>${status}</strong></p>
        <p>Location: ${location}</p>
        <p>Description: ${description}</p>
      `;
      await sendEmail(updatedBooking.email, "Tracking Update - Prince Enterprises", emailHtml);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Tracking update error:", error);
    return NextResponse.json({ error: "Failed to update tracking" }, { status: 500 });
  }
}
