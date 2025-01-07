import { Kafka } from "kafkajs";
import { EventEntity } from '../../core/order/entity/event';
export abstract class IKafkaAdapter<T extends Kafka> {
  client: T

  abstract sendEvent(event: EventEntity): Promise<void>
}