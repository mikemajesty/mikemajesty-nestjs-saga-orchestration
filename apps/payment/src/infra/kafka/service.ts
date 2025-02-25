import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

import { TopicsConsumerEnum, TopicsProducerEnum } from '../../utils/topics';
import { IKafkaAdapter } from './adapter';

@Injectable()
export class KafkaService implements IKafkaAdapter, OnModuleDestroy {
  client: ClientKafka;

  constructor(kafka: ClientKafka) {
    this.client = kafka;
  }

  async onModuleDestroy() {
    await this.client.close();
  }

  async onModuleInit() {
    [
      TopicsConsumerEnum.PAYMENT_FAIL,
      TopicsConsumerEnum.PAYMENT_SUCCESS,
      TopicsProducerEnum.ORCHESTRATOR,
    ].forEach((topic) => {
      this.client.subscribeToResponseOf(topic);
    });
    await this.client.connect();
  }
}
