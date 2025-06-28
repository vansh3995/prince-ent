import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL!)

export async function getFromCache(key: string) {
  const data = await redis.get(key)
  return data ? JSON.parse(data) : null
}

export async function setCache(key: string, data: any, ttl = 3600) {
  await redis.setex(key, ttl, JSON.stringify(data))
}