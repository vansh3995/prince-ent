import { Shipment } from '@/types/shipment'

export const mockShipments: Shipment[] = [
  {
    id: '1',
    trackingNumber: 'AWB123456789',
    awbNumber: 'AWB123456789',
    status: 'In Transit',
    origin: {
      address: '123 Business Park, Sector 18',
      city: 'Noida',
      state: 'Uttar Pradesh',
      pincode: '201301',
      country: 'India'
    },
    destination: {
      address: '456 Corporate Hub, Andheri East',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400069',
      country: 'India'
    },
    packageDetails: {
      weight: 2.5,
      dimensions: { length: 30, width: 20, height: 15 },
      packageType: 'Document',
      description: 'Important business documents',
      value: 5000
    },
    sender: {
      name: 'Rajesh Kumar',
      phone: '+91 9876543210',
      email: 'rajesh@company.com'
    },
    receiver: {
      name: 'Priya Sharma',
      phone: '+91 9876543211',
      email: 'priya@company.com'
    },
    serviceType: 'Express',
    paymentStatus: 'Paid',
    estimatedDelivery: '2024-01-15T18:00:00Z',
    currentLocation: 'Delhi Hub',
    history: [
      {
        id: '1',
        status: 'Booked',
        location: 'Noida',
        timestamp: '2024-01-12T09:00:00Z',
        description: 'Shipment booked successfully',
        updatedBy: 'System'
      },
      {
        id: '2',
        status: 'Picked Up',
        location: 'Noida',
        timestamp: '2024-01-12T14:30:00Z',
        description: 'Package picked up from sender',
        updatedBy: 'Delivery Boy - Amit'
      },
      {
        id: '3',
        status: 'In Transit',
        location: 'Delhi Hub',
        timestamp: '2024-01-13T08:15:00Z',
        description: 'Package sorted and dispatched to Mumbai',
        updatedBy: 'Hub Manager'
      }
    ],
    charges: {
      shippingCharges: 150,
      fuelSurcharge: 15,
      serviceTax: 24.75,
      total: 189.75
    },
    createdAt: '2024-01-12T09:00:00Z',
    updatedAt: '2024-01-13T08:15:00Z'
  },
  {
    id: '2',
    trackingNumber: 'AWB987654321',
    awbNumber: 'AWB987654321',
    status: 'Delivered',
    origin: {
      address: '789 Tech Park, Whitefield',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560066',
      country: 'India'
    },
    destination: {
      address: '321 IT Complex, Hitech City',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500081',
      country: 'India'
    },
    packageDetails: {
      weight: 1.2,
      dimensions: { length: 25, width: 15, height: 10 },
      packageType: 'Electronics',
      description: 'Laptop accessories',
      value: 15000
    },
    sender: {
      name: 'Tech Solutions Pvt Ltd',
      phone: '+91 9876543212',
      email: 'orders@techsolutions.com'
    },
    receiver: {
      name: 'Arun Reddy',
      phone: '+91 9876543213',
      email: 'arun@company.com'
    },
    serviceType: 'Standard',
    paymentStatus: 'Paid',
    estimatedDelivery: '2024-01-10T17:00:00Z',
    actualDelivery: '2024-01-10T16:30:00Z',
    currentLocation: 'Delivered - Hyderabad',
    history: [
      {
        id: '1',
        status: 'Booked',
        location: 'Bangalore',
        timestamp: '2024-01-08T10:00:00Z',
        description: 'Shipment booked successfully'
      },
      {
        id: '2',
        status: 'Picked Up',
        location: 'Bangalore',
        timestamp: '2024-01-08T15:00:00Z',
        description: 'Package picked up from sender'
      },
      {
        id: '3',
        status: 'In Transit',
        location: 'Bangalore Hub',
        timestamp: '2024-01-09T07:00:00Z',
        description: 'Package sorted and dispatched'
      },
      {
        id: '4',
        status: 'Out for Delivery',
        location: 'Hyderabad',
        timestamp: '2024-01-10T09:00:00Z',
        description: 'Out for delivery in Hyderabad'
      },
      {
        id: '5',
        status: 'Delivered',
        location: 'Hyderabad',
        timestamp: '2024-01-10T16:30:00Z',
        description: 'Package delivered successfully to recipient'
      }
    ],
    charges: {
      shippingCharges: 120,
      fuelSurcharge: 12,
      serviceTax: 19.8,
      total: 151.8
    },
    createdAt: '2024-01-08T10:00:00Z',
    updatedAt: '2024-01-10T16:30:00Z'
  },
  {
    id: '3',
    trackingNumber: 'AWB555666777',
    awbNumber: 'AWB555666777',
    status: 'Exception',
    origin: {
      address: '111 Market Street',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411001',
      country: 'India'
    },
    destination: {
      address: '222 Business District',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600001',
      country: 'India'
    },
    packageDetails: {
      weight: 5.0,
      dimensions: { length: 40, width: 30, height: 25 },
      packageType: 'Parcel',
      description: 'Books and stationery',
      value: 3000
    },
    sender: {
      name: 'Educational Supplies',
      phone: '+91 9876543214',
      email: 'orders@edusupplies.com'
    },
    receiver: {
      name: 'Lakshmi Iyer',
      phone: '+91 9876543215',
      email: 'lakshmi@email.com'
    },
    serviceType: 'Economy',
    paymentStatus: 'COD',
    estimatedDelivery: '2024-01-16T18:00:00Z',
    currentLocation: 'Chennai Hub - Exception',
    history: [
      {
        id: '1',
        status: 'Booked',
        location: 'Pune',
        timestamp: '2024-01-11T11:00:00Z',
        description: 'Shipment booked successfully'
      },
      {
        id: '2',
        status: 'Picked Up',
        location: 'Pune',
        timestamp: '2024-01-11T16:00:00Z',
        description: 'Package picked up from sender'
      },
      {
        id: '3',
        status: 'In Transit',
        location: 'Mumbai Hub',
        timestamp: '2024-01-12T08:00:00Z',
        description: 'Package in transit to Chennai'
      },
      {
        id: '4',
        status: 'Exception',
        location: 'Chennai Hub',
        timestamp: '2024-01-13T14:00:00Z',
        description: 'Incorrect address - Unable to deliver. Customer contacted for address clarification.'
      }
    ],
    charges: {
      shippingCharges: 200,
      fuelSurcharge: 20,
      serviceTax: 33,
      total: 253
    },
    createdAt: '2024-01-11T11:00:00Z',
    updatedAt: '2024-01-13T14:00:00Z'
  }
]

export const getShipmentByTrackingNumber = (trackingNumber: string): Shipment | null => {
  return mockShipments.find(shipment => 
    shipment.trackingNumber === trackingNumber || 
    shipment.awbNumber === trackingNumber
  ) || null
}

export const getAllShipments = (): Shipment[] => {
  return mockShipments
}