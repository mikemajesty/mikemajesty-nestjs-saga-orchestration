import { EventEntity } from '@/entities/event';

import { TopicsConsumerEnum, TopicsProducerEnum } from '../../utils/topics';

export abstract class ISagaOrchestratorLibAdapter {
  abstract getNextTopic(
    event: EventEntity,
  ): TopicsProducerEnum | TopicsConsumerEnum;
}
