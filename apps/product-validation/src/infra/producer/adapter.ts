import { Kafka, ProducerRecord } from "kafkajs";
import { ProducerInput } from "../../utils/types";

export abstract class IProducerAdapter<T extends Kafka = Kafka> {
  client: T
  abstract publish(message: ProducerInput): Promise<void>
}