import { z } from 'zod';

import { BaseEntity } from '@/utils/entity';
import { OrderEntity, OrderEntitySchema } from '../../order/entity/order';
import { HistoricEntity, HistoricEntitySchema } from '../../order/entity/historic';

const ID = z.string().uuid().optional().nullish();
const TransactionId = z.string()
const OrderId = z.string()
const Payload = OrderEntitySchema
const Source = z.string().nullish()
const Historic = HistoricEntitySchema
const Status = z.string().nullish()
const CreatedAt = z.date().or(z.string()).nullish().optional().optional();
const UpdatedAt = z.date().or(z.string()).nullish().optional();
const DeletedAt = z.date().or(z.string()).nullish().optional();

export const EventEntitySchema = z.object({
  id: ID,
  transactionId: TransactionId,
  eventHistoric: z.array(Historic).optional(),
  orderId: OrderId,
  payload: Payload,
  status: Status,
  source: Source,
  createdAt: CreatedAt,
  updatedAt: UpdatedAt,
  deletedAt: DeletedAt
});

type Event = z.infer<typeof EventEntitySchema>;

export class EventEntity extends BaseEntity<EventEntity>() {
  transactionId: string

  orderId: string

  payload: OrderEntity

  source: string

  status: string

  eventHistoric: HistoricEntity[]

  constructor(entity: Event) {
    super(EventEntitySchema);
    Object.assign(this, this.validate(entity));
  }
}