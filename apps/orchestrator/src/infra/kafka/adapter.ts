import { Kafka } from "kafkajs";

export abstract class IKafkaAdapter<T extends Kafka> {
  client: T
  abstract sendEvent(event: object, topic: string): Promise<void>
}