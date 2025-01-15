import { ClientKafka } from "@nestjs/microservices";
import { TopicsProducerEnum } from "../../utils/topics";
import { EventEntity } from "@/entities/event";

export abstract class IProducerAdapter {
  client: ClientKafka
  abstract publish(topic: TopicsProducerEnum, payload: EventEntity): Promise<void>
}