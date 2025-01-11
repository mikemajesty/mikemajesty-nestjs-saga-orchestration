import { ClientKafka } from "@nestjs/microservices";

export abstract class IKafkaAdapter {
  client: ClientKafka
}