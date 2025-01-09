import { ClientKafka } from "@nestjs/microservices";
import { TopicsProducerEnum } from "../../utils/topics";
import { Observable } from "rxjs";

export abstract class IProducerAdapter {
  client: ClientKafka
  abstract publish(topic: TopicsProducerEnum, payload: string): Observable<any>
}