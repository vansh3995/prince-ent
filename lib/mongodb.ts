import { MongoClient, Db } from 'mongodb'

let client: MongoClient | null = null
let db: Db | null = null

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  try {
    if (client && db) {
      return { client, db }
    }

    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/prince-enterprises'
    
    client = new MongoClient(uri)
    await client.connect()
    
    db = client.db()
    
    console.log(' MongoDB connected successfully')
    return { client, db }
    
  } catch (error) {
    console.error(' MongoDB connection error:', error)
    
    // Reset connection objects on error
    client = null
    db = null
    
    // Re-throw the error so calling code can handle it
    throw new Error(`Database connection failed: ${error}`)
  }
}

export async function closeDatabaseConnection() {
  try {
    if (client) {
      await client.close()
      client = null
      db = null
      console.log(' MongoDB connection closed')
    }
  } catch (error) {
    console.error('Error closing database connection:', error)
  }
}

// Health check function
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const { db } = await connectToDatabase()
    await db.admin().ping()
    return true
  } catch (error) {
    console.error('Database health check failed:', error)
    return false
  }
}
