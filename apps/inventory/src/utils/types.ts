import { CompressionTypes, Message } from "kafkajs"
import { TopicsEnum } from "./topics"

export interface ProducerInput {
  topic: TopicsEnum
  messages: Message[]
  acks?: number
  timeout?: number
  compression?: CompressionTypes
}

export type ConsumerInput = {
  topics: TopicsEnum[]
  fromBeginning?: boolean 
}

type MessageInput = {
  topic: TopicsEnum
  partition: number
  message: {
    key: Buffer | null
    value: Buffer | null
    timestamp: string
    attributes: number
    offset: string
    size: number
    headers?: never
  }
  heartbeat(): Promise<void>
  pause(): () => void
}

export type EachMessageHandler = (payload: MessageInput) => Promise<void>

export type ConsumerRunInput = {
  autoCommit?: boolean
  autoCommitInterval?: number | null
  autoCommitThreshold?: number | null
  eachBatchAutoResolve?: boolean
  partitionsConsumedConcurrently?: number
  eachMessage?: EachMessageHandler
}