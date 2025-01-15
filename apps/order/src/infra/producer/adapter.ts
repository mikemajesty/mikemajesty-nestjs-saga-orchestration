import { ClientKafka } from "@nestjs/microservices";
import { TopicsProducerEnum } from "../../utils/topics";
import { Observable } from "rxjs";
import { EventEntity } from "@/core/event/entity/event";

export abstract class IProducerAdapter {
  client: ClientKafka
  abstract publish(topic: TopicsProducerEnum, payload: EventEntity): Promise<void>
}