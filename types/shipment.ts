export interface ShipmentStatus {
  id: string
  status: 'Booked' | 'Picked Up' | 'In Transit' | 'Out for Delivery' | 'Delivered' | 'Exception'
  location: string
  timestamp: string
  description: string
  updatedBy?: string
}

export interface Shipment {
  id: string
  trackingNumber: string
  awbNumber: string
  status: ShipmentStatus['status']
  origin: {
    address: string
    city: string
    state: string
    pincode: string
    country: string
  }
  destination: {
    address: string
    city: string
    state: string
    pincode: string
    country: string
  }
  packageDetails: {
    weight: number
    dimensions: {
      length: number
      width: number
      height: number
    }
    packageType: string
    description: string
    value: number
  }
  sender: {
    name: string
    phone: string
    email: string
  }
  receiver: {
    name: string
    phone: string
    email: string
  }
  serviceType: 'Express' | 'Standard' | 'Economy'
  paymentStatus: 'Paid' | 'Pending' | 'COD'
  estimatedDelivery: string
  actualDelivery?: string
  currentLocation: string
  history: ShipmentStatus[]
  charges: {
    shippingCharges: number
    fuelSurcharge: number
    serviceTax: number
    total: number
  }
  createdAt: string
  updatedAt: string
}