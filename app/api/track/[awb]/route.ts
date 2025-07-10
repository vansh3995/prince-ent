import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { awb: string } }
) {
  try {
    const awb = params.awb

    // Mock tracking data for demo
    const mockTrackingData = {
      AWB123456789: {
        awb: 'AWB123456789',
        status: 'delivered',
        origin: 'Mumbai',
        destination: 'Delhi',
        from: 'Mumbai, Maharashtra',
        to: 'Delhi, Delhi',
        expectedDelivery: 'Delivered on Dec 15, 2024',
        timeline: [
          {
            id: '1',
            timestamp: '2024-12-15 14:30',
            status: 'Package Delivered',
            location: 'Delhi, Delhi',
            description: 'Package delivered successfully'
          },
          {
            id: '2',
            timestamp: '2024-12-15 09:15',
            status: 'Out for Delivery',
            location: 'Delhi Hub',
            description: 'Package is out for delivery'
          },
          {
            id: '3',
            timestamp: '2024-12-14 18:45',
            status: 'In Transit',
            location: 'Delhi Hub',
            description: 'Package arrived at destination hub'
          },
          {
            id: '4',
            timestamp: '2024-12-14 10:30',
            status: 'In Transit',
            location: 'Mumbai Hub',
            description: 'Package dispatched from origin'
          },
          {
            id: '5',
            timestamp: '2024-12-13 16:20',
            status: 'Booked',
            location: 'Mumbai, Maharashtra',
            description: 'Package booked and ready for pickup'
          }
        ]
      },
      AWB987654321: {
        awb: 'AWB987654321',
        status: 'in_transit',
        origin: 'Bangalore',
        destination: 'Chennai',
        from: 'Bangalore, Karnataka',
        to: 'Chennai, Tamil Nadu',
        expectedDelivery: 'Expected by Dec 17, 2024',
        timeline: [
          {
            id: '1',
            timestamp: '2024-12-16 08:30',
            status: 'In Transit',
            location: 'Chennai Hub',
            description: 'Package arrived at Chennai hub'
          },
          {
            id: '2',
            timestamp: '2024-12-15 14:15',
            status: 'In Transit',
            location: 'Bangalore Hub',
            description: 'Package dispatched from Bangalore'
          },
          {
            id: '3',
            timestamp: '2024-12-15 10:00',
            status: 'Picked Up',
            location: 'Bangalore, Karnataka',
            description: 'Package picked up from sender'
          }
        ]
      },
      AWB555666777: {
        awb: 'AWB555666777',
        status: 'picked_up',
        origin: 'Pune',
        destination: 'Mumbai',
        from: 'Pune, Maharashtra',
        to: 'Mumbai, Maharashtra',
        expectedDelivery: 'Expected by Dec 16, 2024',
        timeline: [
          {
            id: '1',
            timestamp: '2024-12-15 11:45',
            status: 'Picked Up',
            location: 'Pune, Maharashtra',
            description: 'Package picked up from sender'
          },
          {
            id: '2',
            timestamp: '2024-12-15 09:30',
            status: 'Booked',
            location: 'Pune, Maharashtra',
            description: 'Package booked and scheduled for pickup'
          }
        ]
      }
    }

    const trackingInfo = mockTrackingData[awb as keyof typeof mockTrackingData]

    if (!trackingInfo) {
      return NextResponse.json(
        { message: 'Shipment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(trackingInfo)

  } catch (error) {
    console.error('Tracking error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}