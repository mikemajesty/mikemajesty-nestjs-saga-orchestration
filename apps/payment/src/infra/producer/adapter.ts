import { ClientKafka } from '@nestjs/microservices';

import { EventEntity } from '@/entities/event';

export abstract class IProducerAdapter {
  client: ClientKafka;
  abstract publish(payload: EventEntity): Promise<void>;
}
