import { Kafka } from "kafkajs";
import { Event } from "../../order/entity/event";

export abstract class IKafkaAdapter<T extends Kafka> {
  client: T
  abstract sendEvent(event: Event): Promise<void>
}