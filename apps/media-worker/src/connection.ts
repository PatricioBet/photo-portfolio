import { Redis } from 'ioredis'

let redisClient: Redis | null = null

export async function createRedisConnection(): Promise<Redis> {
  if (redisClient) return redisClient

  const url = process.env.REDIS_URL || 'redis://localhost:6379'
  redisClient = new Redis(url, {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    retryStrategy: (times) => {
      if (times > 5) {
        console.error(`Redis retry failed after ${times} attempts`)
        return null
      }
      return Math.min(times * 200, 2000)
    },
  })

  await redisClient.connect()
  return redisClient
}

export function getRedisConnection(): Redis {
  if (!redisClient) {
    throw new Error('Redis connection not initialized. Call createRedisConnection() first.')
  }
  return redisClient
}

export async function closeRedisConnection(): Promise<void> {
  if (redisClient) {
    await redisClient.quit()
    redisClient = null
  }
}

// Re-export for BullMQ compatibility
export { Redis as IORedisConnection } from 'ioredis'
