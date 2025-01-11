import { ClientKafka, MessagePattern } from "@nestjs/microservices";
import { IKafkaAdapter } from "./adapter";
import { TopicsConsumerEnum, TopicsProducerEnum } from "../../utils/topics";
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
    [TopicsConsumerEnum.NOTIFY_ENDING, TopicsProducerEnum.START_SAGA].forEach(topic => {
      this.client.subscribeToResponseOf(topic);
    })
    await this.client.connect();
    // this.client.commitOffsets([{ offset: "earliest", topic: TopicsConsumerEnum.NOTIFY_ENDING, partition: 0 }])
    console.log("order subscribers:", this.client.getConsumerAssignments());
  }
}