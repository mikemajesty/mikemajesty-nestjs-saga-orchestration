import { ClientKafka } from "@nestjs/microservices";
import { Observable } from "rxjs";

export abstract class IKafkaAdapter {
  client: ClientKafka
}