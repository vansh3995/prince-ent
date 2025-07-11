import { NextRequest, NextResponse } from 'next/server'
import { getShipmentByTrackingNumber } from '@/lib/shipment-data'

export async function GET(
  request: NextRequest,
  { params }: { params: { trackingNumber: string } }
) {
  try {
    const { trackingNumber } = params

    if (!trackingNumber) {
      return NextResponse.json(
        { error: 'Tracking number is required' },
        { status: 400 }
      )
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const shipment = getShipmentByTrackingNumber(trackingNumber)

    if (!shipment) {
      return NextResponse.json(
        { 
          error: 'Shipment not found', 
          message: 'No shipment found with this tracking number. Please check your tracking number and try again.' 
        },
        { status: 404 }
      )
    }

    return NextResponse.json(shipment)
  } catch (error) {
    console.error('Error fetching shipment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}