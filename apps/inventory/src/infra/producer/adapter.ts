import { EventEntity } from "@/entities/event";
import { ClientKafka } from "@nestjs/microservices";
import { Observable } from "rxjs";

export abstract class IProducerAdapter {
  client: ClientKafka
  abstract publish(payload: EventEntity): Promise<void>
}