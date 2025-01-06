import { Kafka } from "kafkajs";

export abstract class IKafkaAdapter<T extends Kafka> {
  client: T
}