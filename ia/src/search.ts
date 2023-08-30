import { redis, redisVectorStore } from './redis-store'

async function search() {
  await redis.connect()

  const response = await redisVectorStore.similaritySearchWithScore(
    'O que é picking em um supermercado?',
    5,
  )

  console.log(response)

  await redis.disconnect()
}

search()
