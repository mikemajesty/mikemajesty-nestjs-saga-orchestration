import { CompressionTypes, Message } from "kafkajs"
import { TopicsConsumerEnum } from "./topics"

export interface ProducerInput {
  topic: TopicsConsumerEnum
  messages: Message[]
  acks?: number
  timeout?: number
  compression?: CompressionTypes
}

export type ConsumerInput = {
  topics: TopicsConsumerEnum[]
  fromBeginning?: boolean 
}

type MessageInput = {
  topic: TopicsConsumerEnum
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