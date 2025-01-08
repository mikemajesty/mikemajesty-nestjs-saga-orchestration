import { ConsumerRunConfig, ConsumerSubscribeTopics, Kafka, ProducerRecord } from "kafkajs";

export abstract class IConsumerAdapter<T extends Kafka = Kafka> {
  client: T
  abstract consume(topic: ConsumerSubscribeTopics, config: ConsumerRunConfig): Promise<void>
}