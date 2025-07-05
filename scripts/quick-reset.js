require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function quickReset() {
  try {
    console.log(' Starting quick database reset...');
    
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      throw new Error('MONGODB_URI not found in environment variables');
    }
    
    console.log(' Connecting to MongoDB Atlas...');
    const client = new MongoClient(uri);
    
    await client.connect();
    console.log(' Connected to MongoDB Atlas');
    
    const db = client.db('prince-ent');
    
    // Create admin user
    console.log(' Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await db.collection('admins').deleteMany({});
    await db.collection('admins').insertOne({
      username: 'admin',
      email: 'admin@princeenterprises.com',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date()
    });
    
    console.log(' Admin user created successfully');
    console.log(' Email: admin@princeenterprises.com');
    console.log(' Username: admin');
    console.log(' Password: admin123');
    
    await client.close();
    console.log(' Database reset completed');
    
  } catch (error) {
    console.error(' Error during reset:', error.message);
    process.exit(1);
  }
}

quickReset();
