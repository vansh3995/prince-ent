// lib/mongodb.ts
import { MongoClient, Db } from "mongodb"

const uri = process.env.MONGODB_URI as string

if (!uri) {
  throw new Error("❌ Please add your MongoDB URI to .env.local as MONGODB_URI")
}

const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

// Use a global variable in development to prevent multiple connections during hot reloads
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  // In production, do not use a global variable
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  try {
    const client = await clientPromise
    const db = client.db('prince-ent') // Explicitly specify database name
    return { client, db }
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw new Error('Failed to connect to MongoDB')
  }
}

export default clientPromise
