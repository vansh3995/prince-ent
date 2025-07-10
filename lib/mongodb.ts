import { MongoClient, Db } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable')
}

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const client = new MongoClient(MONGODB_URI!)
  await client.connect()
  
  const db = client.db('princeenterprises')
  
  cachedClient = client
  cachedDb = db
  
  return { client, db }
}

// Alternative export for compatibility
export async function connectDB() {
  const { db } = await connectToDatabase()
  return db
}
