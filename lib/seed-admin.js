const { MongoClient } = require('mongodb')
const bcrypt = require('bcryptjs')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017'
const DB_NAME = process.env.DB_NAME || 'prince-enterprises'

async function seedAdminUser() {
  let client

  try {
    console.log(' Connecting to MongoDB...')
    client = new MongoClient(MONGODB_URI)
    await client.connect()
    
    const db = client.db(DB_NAME)
    console.log(' Connected to MongoDB')

    // Check if admin already exists
    const existingAdmin = await db.collection('admins').findOne({ username: 'admin' })
    
    if (existingAdmin) {
      console.log('ℹ  Admin user already exists')
      return
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    const adminUser = {
      username: 'admin',
      email: 'admin@princeenterprises.com',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
      isActive: true
    }

    await db.collection('admins').insertOne(adminUser)
    console.log(' Admin user created successfully!')
    console.log('Username: admin')
    console.log('Password: admin123')
    
  } catch (error) {
    console.error(' Error seeding admin user:', error.message)
    throw error
  } finally {
    if (client) {
      await client.close()
      console.log(' Database connection closed')
    }
  }
}

module.exports = { seedAdminUser }

// Run if called directly
if (require.main === module) {
  seedAdminUser()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}
