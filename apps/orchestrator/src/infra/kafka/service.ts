import { ClientKafka, MessagePattern } from "@nestjs/microservices";
import { IKafkaAdapter } from "./adapter";
import { TopicsConsumerEnum } from "../../utils/topics";
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
    [TopicsConsumerEnum.FINISH_FAIL, TopicsConsumerEnum.FINISH_SUCCESS, TopicsConsumerEnum.ORCHESTRATOR, TopicsConsumerEnum.START_SAGA].forEach(topic => {
      this.client.subscribeToResponseOf(topic);
    })
    await this.client.connect();
    console.log("orchestrator subscribers:", this.client.getConsumerAssignments());
  }
}