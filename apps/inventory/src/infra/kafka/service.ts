import { ClientKafka, MessagePattern } from "@nestjs/microservices";
import { IKafkaAdapter } from "./adapter";
import { TopicsEnum } from "../../utils/topics";
import { Observable } from "rxjs";

export class KafkaService implements IKafkaAdapter {
  client: ClientKafka;

  constructor(kafka: ClientKafka) {
    this.client = kafka
  }

  send(pattern: TopicsEnum, data: any): Observable<any> {
    return this.client.send(pattern, data);
  }

  async onModuleInit() {
    this.client.subscribeToResponseOf(TopicsEnum.INVENTORY_FAIL);
    await this.client.connect();
    console.log("iventory subscribers:", this.client.getConsumerAssignments());
  }
}