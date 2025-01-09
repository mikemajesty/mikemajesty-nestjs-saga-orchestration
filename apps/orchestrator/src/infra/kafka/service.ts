import { ClientKafka, MessagePattern } from "@nestjs/microservices";
import { IKafkaAdapter } from "./adapter";
import { TopicsEnum } from "../../utils/topics";
import { Observable } from "rxjs";
import { Injectable, OnModuleDestroy } from "@nestjs/common";

@Injectable()
export class KafkaService implements IKafkaAdapter, OnModuleDestroy {
  client: ClientKafka;

  constructor(kafka: ClientKafka) {
    this.client = kafka
  }

  async onModuleDestroy() {
    await this.client.close();
  }

  async onModuleInit() {
    this.client.subscribeToResponseOf(TopicsEnum.NOTIFY_ENDING);
    await this.client.connect();
    console.log("orchestrator subscribers:", this.client.getConsumerAssignments());
  }
}