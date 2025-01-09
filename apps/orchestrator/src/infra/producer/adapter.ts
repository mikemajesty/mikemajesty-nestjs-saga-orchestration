import { ClientKafka } from "@nestjs/microservices";
import { TopicsProducerEnum } from "../../utils/topics";

export abstract class IProducerAdapter {
  client: ClientKafka
  abstract publish(topic: TopicsProducerEnum, payload: string)
}