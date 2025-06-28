// lib/mongodb.ts
import { MongoClient, Db } from "mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error("❌ Please add your MongoDB URI to .env.local as MONGODB_URI")
}

const uri: string = process.env.MONGODB_URI
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

// Use a global variable in development to prevent multiple connections during hot reloads
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  try {
    const client = await clientPromise
    const db = client.db('prince-enterprise') // Explicitly specify database name
    return { client, db }
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw new Error('Failed to connect to database')
  }
}

// Add to lib/mongodb.ts
export async function createIndexes() {
  const { db } = await connectToDatabase()
  
  // Performance indexes
  await db.collection('bookings').createIndex({ awbNumber: 1 })
  await db.collection('bookings').createIndex({ 'pickup.city': 1, 'delivery.city': 1 })
  await db.collection('bookings').createIndex({ userId: 1, createdAt: -1 })
  await db.collection('shipments').createIndex({ awbNumber: 1 })
  await db.collection('users').createIndex({ email: 1 })
}

export default clientPromise
