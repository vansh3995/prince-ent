const { MongoClient } = require('mongodb')
const bcrypt = require('bcryptjs')

async function seedDatabase() {
  const uri = process.env.MONGODB_URI || 'mongodb+srv://aaru2301:Aaru%40230102@princeenterprises.rgm7qp7.mongodb.net/?retryWrites=true&w=majority&appName=PrinceEnterprises'
  const dbName = 'prince-enterprises'
  
  const client = new MongoClient(uri)
  
  try {
    await client.connect()
    console.log(' Connected to MongoDB')
    
    const db = client.db(dbName)
    
    // Clear existing data
    await db.collection('admins').deleteMany({})
    await db.collection('users').deleteMany({})
    await db.collection('bookings').deleteMany({})
    
    console.log(' Cleared existing data')
    
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12)
    const admin = {
      username: 'admin',
      email: 'admin@princeenterprises.com', 
      password: adminPassword,
      role: 'admin',
      createdAt: new Date()
    }
    await db.collection('admins').insertOne(admin)
    
    // Create demo user
    const userPassword = await bcrypt.hash('user123', 12)
    const user = {
      name: 'Demo User',
      email: 'user@example.com',
      password: userPassword,
      role: 'user',
      createdAt: new Date()
    }
    await db.collection('users').insertOne(user)
    
    // Create demo bookings
    const bookings = [
      {
        awb: 'AWB123456789',
        status: 'delivered',
        origin: 'Mumbai',
        destination: 'Delhi',
        from: 'Mumbai, Maharashtra',
        to: 'Delhi, Delhi',
        customerEmail: 'user@example.com',
        customerName: 'Demo User',
        createdAt: new Date('2024-12-13'),
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
          }
        ]
      },
      {
        awb: 'AWB987654321',
        status: 'in_transit',
        origin: 'Bangalore',
        destination: 'Chennai', 
        from: 'Bangalore, Karnataka',
        to: 'Chennai, Tamil Nadu',
        customerEmail: 'user@example.com',
        customerName: 'Demo User',
        createdAt: new Date('2024-12-15'),
        expectedDelivery: 'Expected by Dec 17, 2024',
        timeline: [
          {
            id: '1',
            timestamp: '2024-12-16 08:30', 
            status: 'In Transit',
            location: 'Chennai Hub',
            description: 'Package arrived at Chennai hub'
          }
        ]
      }
    ]
    
    await db.collection('bookings').insertMany(bookings)
    
    console.log(' Database seeded successfully!')
    console.log('')
    console.log(' Login Credentials:')
    console.log('Admin - Username: admin, Password: admin123')
    console.log('User - Email: user@example.com, Password: user123')
    console.log('')
    console.log(' Demo AWB Numbers:')
    console.log('AWB123456789 (Delivered)')
    console.log('AWB987654321 (In Transit)')
    
  } catch (error) {
    console.error(' Seeding failed:', error)
  } finally {
    await client.close()
  }
}

seedDatabase()
