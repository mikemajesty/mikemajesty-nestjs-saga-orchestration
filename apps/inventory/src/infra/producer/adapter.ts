import { EventEntity } from "@/entities/event";
import { ClientKafka } from "@nestjs/microservices";

export abstract class IProducerAdapter {
  client: ClientKafka
  abstract publish(payload: EventEntity): Promise<void>
}