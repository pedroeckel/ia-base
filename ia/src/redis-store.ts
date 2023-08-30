import { RedisVectorStore } from 'langchain/vectorstores/redis'
import { OpenAIEmbeddings } from 'langchain/embeddings'
import { createClient } from 'redis'

export const redis = createClient({
  url: 'redis://127.0.0.1:6379',
})

export const redisVectorStore = new RedisVectorStore(
  new OpenAIEmbeddings({
    openAIApiKey: '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',
  }),
  {
    indexName: 'test-embeddings',
    redisClient: redis,
    keyPrefix: 'dissertation:',
  },
)
