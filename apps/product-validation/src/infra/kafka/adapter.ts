import { ClientKafka } from "@nestjs/microservices";
import { TopicsEnum } from "../../utils/topics";
import { Observable } from "rxjs";

export abstract class IKafkaAdapter {
  client: ClientKafka
  abstract send(pattern: TopicsEnum, data: any): Observable<any>
}