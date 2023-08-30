import path from 'node:path'

import { DirectoryLoader } from 'langchain/document_loaders/fs/directory'
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import { TokenTextSplitter } from 'langchain/text_splitter'
import { createClient } from 'redis'
import { RedisVectorStore } from 'langchain/vectorstores/redis'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'

const loader = new DirectoryLoader(path.join(__dirname, '../tmp'), {
  '.pdf': (path) =>
    new PDFLoader(path, {
      splitPages: false,
    }),
})

async function load() {
  const docs = await loader.load()

  const splitter = new TokenTextSplitter({
    encodingName: 'cl100k_base',
    chunkSize: 600,
    chunkOverlap: 0,
  })

  const splittedDocuments = await splitter.splitDocuments(docs)

  const redis = createClient({
    url: 'redis://127.0.0.1:6379',
  })

  await redis.connect()

  await RedisVectorStore.fromDocuments(
    splittedDocuments,
    new OpenAIEmbeddings({
      openAIApiKey: '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',
    }),
    {
      indexName: 'test-embeddings',
      redisClient: redis,
      keyPrefix: 'dissertation:',
    },
  )

  await redis.disconnect()
}

load()
