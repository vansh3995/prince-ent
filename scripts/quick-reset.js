const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

async function resetDatabase() {
  try {
    console.log('🔄 Connecting to database...');
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('prince-ent'); // Explicitly specify database name

    // Create admin user with BOTH roles
    console.log('🔐 Creating admin user...');
    
    // Use exact same method as login API
    const adminPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    
    // Test hash immediately
    const testHash = await bcrypt.compare(adminPassword, hashedPassword);
    console.log('🧪 Hash test:', testHash ? '✅ PASS' : '❌ FAIL');

    const adminUser = {
      name: 'Admin',
      email: 'admin@princeenterprises.com',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
      isVerified: true,
      isActive: true
    };

    // Delete and recreate
    await db.collection('users').deleteOne({ email: 'admin@princeenterprises.com' });
    const result = await db.collection('users').insertOne(adminUser);

    console.log('✅ Admin user created!');
    console.log('📧 Email: admin@princeenterprises.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: admin');

    // Final verification
    const verifyUser = await db.collection('users').findOne({ email: 'admin@princeenterprises.com' });
    if (verifyUser) {
      const finalTest = await bcrypt.compare('admin123', verifyUser.password);
      console.log('🎯 Final test:', finalTest ? '✅ SUCCESS' : '❌ FAIL');
    }

    await client.close();
    console.log('🎉 Reset complete!');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

resetDatabase();