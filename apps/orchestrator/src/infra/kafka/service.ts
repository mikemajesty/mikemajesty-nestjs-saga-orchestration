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
      TopicsProducerEnum.PRODUCT_VALIDATION_SUCCESS,
      TopicsProducerEnum.PRODUCT_VALIDATION_FAIL,
      TopicsProducerEnum.INVENTORY_SUCCESS,
      TopicsProducerEnum.INVENTORY_FAIL,
      TopicsProducerEnum.PAYMENT_SUCCESS,
      TopicsProducerEnum.PAYMENT_FAIL,
      TopicsProducerEnum.NOTIFY_ENDING,
      TopicsConsumerEnum.FINISH_FAIL,
      TopicsConsumerEnum.FINISH_SUCCESS,
      TopicsConsumerEnum.ORCHESTRATOR,
      TopicsConsumerEnum.START_SAGA,
    ].forEach((topic) => {
      this.client.subscribeToResponseOf(topic);
    });
    await this.client.connect();
  }
}
