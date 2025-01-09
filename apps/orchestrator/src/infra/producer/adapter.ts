import { ClientKafka } from "@nestjs/microservices";
import { TopicsEnum } from "../../utils/topics";

export abstract class IProducerAdapter {
  client: ClientKafka
  abstract publish(topic: TopicsEnum, payload: string)
}