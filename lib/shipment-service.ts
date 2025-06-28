import { connectToDatabase } from './mongodb'

export interface ShipmentUpdate {
  id: string
  timestamp: Date
  status: string
  location: string
  description: string
}

export interface ShipmentData {
  awbNumber: string
  status: string
  currentLocation: string
  estimatedDelivery: Date | null
  trackingHistory: ShipmentUpdate[]
  senderName?: string
  receiverName?: string
  fromCity?: string
  toCity?: string
}

export async function getShipmentUpdates(awb: string): Promise<ShipmentData | null> {
  try {
    const { db } = await connectToDatabase()
    
    // First check shipments collection
    let shipment = await db.collection('shipments').findOne({ awbNumber: awb })
    
    // If not found in shipments, check bookings collection
    if (!shipment) {
      const booking = await db.collection('bookings').findOne({ awbNumber: awb })
      
      if (booking) {
        // Create shipment data from booking
        shipment = {
          awbNumber: booking.awbNumber,
          status: booking.status || 'pending',
          currentLocation: booking.fromCity,
          estimatedDelivery: null,
          trackingHistory: [
            {
              id: '1',
              timestamp: booking.createdAt,
              status: 'booked',
              location: booking.fromCity,
              description: 'Booking confirmed'
            }
          ],
          senderName: booking.senderName,
          receiverName: booking.receiverName,
          fromCity: booking.fromCity,
          toCity: booking.toCity
        } as any
      }
    }
    
    if (!shipment) {
      return null
    }

    return {
      awbNumber: shipment.awbNumber,
      status: shipment.status,
      currentLocation: shipment.currentLocation,
      estimatedDelivery: shipment.estimatedDelivery,
      trackingHistory: shipment.trackingHistory || [],
      senderName: shipment.senderName,
      receiverName: shipment.receiverName,
      fromCity: shipment.fromCity,
      toCity: shipment.toCity
    }
  } catch (error) {
    console.error('Error fetching shipment updates:', error)
    return null
  }
}

export async function updateShipmentStatus(
  awb: string, 
  status: string, 
  location: string, 
  description: string
) {
  try {
    const { db } = await connectToDatabase()
    
    const newUpdate = {
      id: Date.now().toString(),
      timestamp: new Date(),
      status,
      location,
      description
    }
    
    // Update shipments collection
    await db.collection('shipments').updateOne(
      { awbNumber: awb },
      {
        $set: {
          status,
          currentLocation: location,
          updatedAt: new Date()
        },
        $push: {
          trackingHistory: newUpdate
        }
      },
      { upsert: true }
    )
    
    // Also update bookings collection
    await db.collection('bookings').updateOne(
      { awbNumber: awb },
      {
        $set: {
          status,
          updatedAt: new Date()
        }
      }
    )
    
    return true
  } catch (error) {
    console.error('Error updating shipment status:', error)
    return false
  }
}

export async function createShipmentFromBooking(booking: any) {
  try {
    const { db } = await connectToDatabase()
    
    const shipment = {
      awbNumber: booking.awbNumber,
      status: 'pending',
      currentLocation: booking.fromCity,
      estimatedDelivery: null,
      trackingHistory: [
        {
          id: '1',
          timestamp: new Date(),
          status: 'booked',
          location: booking.fromCity,
          description: 'Shipment booked successfully'
        }
      ],
      senderName: booking.senderName,
      receiverName: booking.receiverName,
      fromCity: booking.fromCity,
      toCity: booking.toCity,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    await db.collection('shipments').insertOne(shipment)
    return shipment
  } catch (error) {
    console.error('Error creating shipment:', error)
    return null
  }
}