import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(req: Request, { params }: { params: { awb: string } }) {
  const { db } = await connectToDatabase();
  const parcel = await db.collection("bookings").findOne({ awb: params.awb });
  if (!parcel) {
    return NextResponse.json({ error: "Parcel not found" }, { status: 404 });
  }
  return NextResponse.json({ parcel });
}