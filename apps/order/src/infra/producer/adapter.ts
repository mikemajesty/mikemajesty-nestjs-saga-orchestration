import { ClientKafka } from '@nestjs/microservices';

import { EventEntity } from '@/core/event/entity/event';

import { TopicsProducerEnum } from '../../utils/topics';

export abstract class IProducerAdapter {
  client: ClientKafka;
  abstract publish(
    topic: TopicsProducerEnum,
    payload: EventEntity,
  ): Promise<void>;
}
