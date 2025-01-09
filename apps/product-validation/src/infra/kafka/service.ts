import { ClientKafka, MessagePattern } from "@nestjs/microservices";
import { IKafkaAdapter } from "./adapter";
import { Observable } from "rxjs";
import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { TopicsConsumerEnum } from "../../utils/topics";

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
    [TopicsConsumerEnum.PRODUCT_VALIDATION_FAIL, TopicsConsumerEnum.PRODUCT_VALIDATION_SUCCESS].forEach(topic => {
      this.client.subscribeToResponseOf(topic);
    })
    await this.client.connect();
    console.log("product-validation subscribers:", this.client.getConsumerAssignments());
  }
}