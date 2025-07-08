import { connectToDatabase } from './mongodb'
import bcrypt from 'bcryptjs'

export async function seedAdminUser() {
  try {
    const { db } = await connectToDatabase()
    
    // Check if admin already exists
    const existingAdmin = await db.collection('admins').findOne({ username: 'admin' })
    
    if (existingAdmin) {
      console.log('Admin user already exists')
      return
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 12)

    // Create admin user
    const adminUser = {
      username: 'admin',
      email: 'admin@princeenterprises.com',
      password: hashedPassword,
      role: 'superadmin',
      createdAt: new Date(),
      isActive: true
    }

    await db.collection('admins').insertOne(adminUser)
    console.log('Admin user created successfully')
    
  } catch (error) {
    console.error('Error seeding admin user:', error)
  }
}
