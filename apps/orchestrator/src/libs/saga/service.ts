import { EventEntity } from '@/entities/event';
import { ILoggerAdapter } from '@/infra/logger';
import { ApiBadRequestException } from '@/utils/exception';

import { SagaOrderUtils } from '../../utils/saga-order';
import {
  SagaStatus,
  TopicsConsumerEnum,
  TopicsProducerEnum,
} from '../../utils/topics';
import { ISagaOrchestratorLibAdapter } from './adapter';

export class SagaOrchestratorLibService implements ISagaOrchestratorLibAdapter {
  constructor(private readonly logger: ILoggerAdapter) {}

  public getNextTopic(
    event: EventEntity,
  ): TopicsProducerEnum | TopicsConsumerEnum {
    if (!event.status || !event.source) {
      throw new ApiBadRequestException('source and status must be informed');
    }
    return this.findByTopicAndStatus(event);
  }

  private findByTopicAndStatus(
    event: EventEntity,
  ): TopicsProducerEnum | TopicsConsumerEnum {
    const topicIndex = SagaOrderUtils.Handler.find((handler) => {
      const source = handler[SagaOrderUtils.EVENT_SOURCE_INDEX];
      const status = handler[SagaOrderUtils.EVENT_STATUS_INDEX];
      return source === event.source && status === event.status;
    });

    if (!topicIndex) {
      throw new ApiBadRequestException('topic not found');
    }

    const topic = topicIndex[SagaOrderUtils.NEXT_TOPIC_INDEX] as
      | TopicsProducerEnum
      | TopicsConsumerEnum;
    this.logCurrentEvent(event, topic);

    return topic;
  }

  private logCurrentEvent(
    event: EventEntity,
    topic: TopicsProducerEnum | TopicsConsumerEnum,
  ) {
    const sagaId = `ORDER_ID ${event.orderId} | TRANSACTION_ID: ${event.transactionId} | EVENT_ID: ${event.id}`;
    const source = event.source;
    const log = {
      [SagaStatus.SUCCESS]: () =>
        `####### CURRENT_EVENT ${source} | SUCCESS | NEXT_TOPIC ${topic} | SAGA_ID ${sagaId}`,
      [SagaStatus.ROLLBACK_PENDING]: () =>
        `####### CURRENT_EVENT ${source} | SENDIND_TO_ROLLBACK_CURRENT_SERVICE | NEXT_TOPIC ${topic} | SAGA_ID ${sagaId}`,
      [SagaStatus.FAIL]: () =>
        `####### CURRENT_EVENT ${source} | SENDIND_TO_ROLLBACK_PREVIOUS_SERVICE | NEXT_TOPIC ${topic} | SAGA_ID ${sagaId}`,
    }[event.status];

    this.logger.info({ message: log() });
  }
}
