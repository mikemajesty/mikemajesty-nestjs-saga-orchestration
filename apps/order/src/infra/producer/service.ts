import { Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

import { EventEntity } from '@/core/event/entity/event';
import { ILoggerAdapter } from '@/infra/logger';

import { TopicsProducerEnum } from '../../utils/topics';
import { IKafkaAdapter } from '../kafka/adapter';
import { IProducerAdapter } from './adapter';

@Injectable()
export class ProducerService implements IProducerAdapter {
  client: ClientKafka;

  constructor(
    kafka: IKafkaAdapter,
    private readonly logger: ILoggerAdapter,
  ) {
    this.client = kafka.client;
  }

  async publish(
    topic: TopicsProducerEnum,
    payload: EventEntity,
  ): Promise<void> {
    const context = `Order/ProducerService`;

    this.logger.info({
      message: `message received from: ${topic} with orderId: ${payload.orderId} and transactionId: ${payload.transactionId}`,
    });
    try {
      return new Promise((res) => {
        this.client.emit(topic, JSON.stringify(payload)).subscribe({
          error: (error) => {
            res(error);
          },
          complete: () => {
            this.logger.info({
              message: `message sent to topic: ${topic} with orderId: ${payload.orderId} and transactionId: ${payload.transactionId}`,
            });
            res();
          },
        });
      });
    } catch (error) {
      error.parameters = {
        topic,
        context,
        payload,
      };
      this.logger.error(error);
    }
  }
}
