import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Demo notifications data
    const notifications = [
      {
        id: '1',
        title: 'New Booking Received',
        message: 'A new shipment booking has been submitted',
        type: 'booking',
        read: false,
        timestamp: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Quote Request',
        message: 'Customer requested a shipping quote',
        type: 'quote',
        read: false,
        timestamp: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: '3',
        title: 'Shipment Delivered',
        message: 'AWB123456789 has been delivered successfully',
        type: 'delivery',
        read: false,
        timestamp: new Date(Date.now() - 7200000).toISOString()
      },
      {
        id: '4',
        title: 'Payment Received',
        message: 'Payment for booking #12345 received',
        type: 'payment',
        read: true,
        timestamp: new Date(Date.now() - 86400000).toISOString()
      }
    ]

    return NextResponse.json({
      success: true,
      notifications
    })
  } catch (error) {
    console.error('Notifications error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}
