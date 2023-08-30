import { PromptTemplate } from 'langchain/prompts'
import { RetrievalQAChain } from 'langchain/chains'

import { ChatOpenAI } from 'langchain/chat_models/openai'
import { redis, redisVectorStore } from './redis-store'

const openAiChat = new ChatOpenAI({
  openAIApiKey: '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',
  modelName: 'gpt-3.5-turbo',
  temperature: 0.3,
})

const prompt = new PromptTemplate({
  template: `
    Você responde perguntas sobre uma dissertação de mestrado.
    O usuário está buscando mais informações sobre o assunto e quer respostas mais completas possíveis.
    Use o conteúdo da dissertação para responder as perguntas do usuário.
    Se a resposta não for encontrada nas transcrições, responda que você não sabe, não tente inventar uma resposta.

    Se possível, inclua exemplos

    Dissertação:
    {context}

    Pergunta:
    {question}
    `.trim(),
  inputVariables: ['context', 'question'],
})

const chain = RetrievalQAChain.fromLLM(
  openAiChat,
  redisVectorStore.asRetriever(),
  {
    prompt,
  },
)

async function main() {
  await redis.connect()

  const response = await chain.call({
    query: 'Qual o objetivo da dissertação?',
  })

  console.log(response)

  await redis.disconnect()
}

main()
