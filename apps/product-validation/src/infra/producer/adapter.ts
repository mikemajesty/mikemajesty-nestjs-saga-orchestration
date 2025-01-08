import { Kafka, ProducerRecord } from "kafkajs";

export abstract class IProducerAdapter<T extends Kafka = Kafka> {
  client: T
  abstract publish(message: ProducerRecord): Promise<void>
}