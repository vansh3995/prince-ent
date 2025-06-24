// Run this script once to create superadmin
// node scripts/setup-superadmin.js

import { MongoClient } from 'mongodb'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const uri = process.env.MONGODB_URI

async function createSuperAdmin() {
  console.log('🔄 Attempting to connect to MongoDB Atlas...')
  
  if (!uri) {
    console.error('❌ MONGODB_URI not found in .env.local')
    return
  }
  
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  })
  
  try {
    await client.connect()
    console.log('✅ Connected to MongoDB Atlas successfully!')
    
    const db = client.db('prince-ent')
    
    // Create indexes for better performance
    await db.collection('users').createIndex({ email: 1 }, { unique: true })
    await db.collection('bookings').createIndex({ awb: 1 }, { unique: true })
    await db.collection('bookings').createIndex({ userId: 1 })
    await db.collection('notifications').createIndex({ createdAt: -1 })
    
    const hashedPassword = await bcrypt.hash('superadmin123', 12)
    
    const superAdmin = {
      email: 'superadmin@princeent.com',
      password: hashedPassword,
      name: 'Super Admin',
      role: 'superadmin',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    // Check if superadmin already exists
    const existing = await db.collection('users').findOne({ email: superAdmin.email })
    
    if (existing) {
      console.log('✅ Super Admin already exists!')
      console.log('📧 Email:', superAdmin.email)
      console.log('🔑 Password: superadmin123')
      console.log('👤 Role:', existing.role)
      
      // Update role if needed
      await db.collection('users').updateOne(
        { email: superAdmin.email },
        { $set: { role: 'superadmin', updatedAt: new Date() } }
      )
    } else {
      await db.collection('users').insertOne(superAdmin)
      console.log('✅ Super Admin created successfully!')
      console.log('📧 Email:', superAdmin.email)
      console.log('🔑 Password: superadmin123')
      console.log('👤 Role: superadmin')
    }
    
    // Also create/update regular admin
    const regularAdmin = {
      email: 'admin@princeent.com',
      password: await bcrypt.hash('admin123', 12),
      name: 'Admin User',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const existingAdmin = await db.collection('users').findOne({ email: regularAdmin.email })
    if (!existingAdmin) {
      await db.collection('users').insertOne(regularAdmin)
      console.log('✅ Regular Admin also created!')
      console.log('📧 Email: admin@princeent.com')
      console.log('🔑 Password: admin123')
    }
    
    // Create sample booking for testing
    const sampleBooking = {
      awb: 'PE' + Date.now() + 'DEMO',
      bookingId: 'PE' + Date.now() + 'DEMO',
      serviceType: 'express',
      packageType: 'parcel',
      weight: '2.5',
      value: '1000',
      description: 'Sample booking for testing',
      pickup: {
        name: 'John Doe',
        phone: '9876543210',
        address: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        email: 'john@example.com',
        date: new Date().toISOString().split('T')[0]
      },
      delivery: {
        name: 'Jane Smith',
        phone: '9876543211',
        address: '456 Park Avenue',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001',
        email: 'jane@example.com'
      },
      userId: 'sample_user',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const existingBooking = await db.collection('bookings').findOne({ awb: sampleBooking.awb })
    if (!existingBooking) {
      await db.collection('bookings').insertOne(sampleBooking)
      console.log('✅ Sample booking created for testing!')
    }
    
    console.log('\n🎉 Setup completed successfully!')
    console.log('🌐 You can now login at: http://localhost:3000/admin/login')
    
  } catch (error) {
    console.error('❌ Error creating Super Admin:', error.message)
    console.log('\n🔧 Possible solutions:')
    console.log('1. ✅ Check MongoDB Atlas connection string in .env.local')
    console.log('2. 🌐 Ensure your IP is whitelisted in MongoDB Atlas')
    console.log('3. 🔑 Check username/password in connection string')
    console.log('4. 🚀 Try running: npm install mongodb bcryptjs dotenv')
    
  } finally {
    await client.close()
  }
}

createSuperAdmin()