import { Server } from 'socket.io'
import { getShipmentUpdates } from './shipment-service'

export function initializeSocket(server: any) {
  const io = new Server(server, {
    cors: { origin: "*" }
  })
  
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id)
    
    socket.on('track-shipment', async (awb) => {
      console.log('Tracking request for AWB:', awb)
      
      try {
        // Real-time tracking updates
        const updates = await getShipmentUpdates(awb)
        
        if (updates) {
          socket.emit('shipment-update', {
            success: true,
            data: updates
          })
        } else {
          socket.emit('shipment-update', {
            success: false,
            message: 'Shipment not found'
          })
        }
      } catch (error) {
        console.error('Error in track-shipment:', error)
        socket.emit('shipment-update', {
          success: false,
          message: 'Error fetching shipment data'
        })
      }
    })

    socket.on('join-shipment-room', (awb) => {
      socket.join(`shipment-${awb}`)
      console.log(`Socket ${socket.id} joined room: shipment-${awb}`)
    })

    socket.on('leave-shipment-room', (awb) => {
      socket.leave(`shipment-${awb}`)
      console.log(`Socket ${socket.id} left room: shipment-${awb}`)
    })
    
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id)
    })
  })
  
  return io
}

// Function to broadcast updates to all clients tracking a shipment
export function broadcastShipmentUpdate(io: any, awb: string, updateData: any) {
  io.to(`shipment-${awb}`).emit('shipment-update', {
    success: true,
    data: updateData
  })
}