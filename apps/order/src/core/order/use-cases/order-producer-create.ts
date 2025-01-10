import { ILoggerAdapter } from '@/infra/logger';
import { z } from 'zod';

import { ValidateSchema } from '@/utils/decorators';

import { IOrderProducerCreateAdapter } from '../../../modules/order/adapter';
import { OrderProductEntity, OrderProductEntitySchema } from '../entity/order-product';
import { UUIDUtils } from '@/utils/uuid';
import { OrderEntity } from '../entity/order';
import { EventEntity } from '../../event/entity/event';
import { IOrderRepository } from '../repository/order';
import { IProducerAdapter } from 'apps/order/src/infra/producer/adapter';
import { TopicsProducerEnum } from 'apps/order/src/utils/topics';
import { firstValueFrom } from 'rxjs';
import { DateUtils } from '@/utils/date';
import { IEventRepository } from '@/core/event/repository/event';

export const OrderProducerCreateInputSchema = z.object({
  products: z.array(OrderProductEntitySchema).min(1),
  trasactionId: z.string().nullish(),
  createdAt: z.date().or(z.string()).nullish().optional(),
})

export class OrderProducerCreateUsecase implements IOrderProducerCreateAdapter {

  constructor(
    private readonly producer: IProducerAdapter,
    private  readonly logger: ILoggerAdapter,
    private  readonly orderRepository: IOrderRepository,
    private  readonly eventRepository: IEventRepository,
  ) {}

  @ValidateSchema(OrderProducerCreateInputSchema)
  async execute(input: OrderProducerCreateInput): Promise<any> {
    const date = DateUtils.getDate()
    const products = input.products.map(p => new OrderProductEntity(p))
    const transactionId = `${DateUtils.date.now().toMillis()}_${UUIDUtils.create()}`

    this.logger.setGlobalParameters({ traceId: transactionId })

    this.logger.info({ message: `saga: ${TopicsProducerEnum.START_SAGA} started with traceId: ${transactionId}`, obj: {
      paylod: input
    } })

    const orderEntity = new OrderEntity({
      products,
      transactionId,
      createdAt: date.toJSDate()
    })

    await this.orderRepository.create(orderEntity)
    this.logger.info({ message: `order created with id: ${orderEntity.id}` })

    const eventEntity = new EventEntity({
      orderId: orderEntity.id,
      payload: orderEntity,
      transactionId: orderEntity.transactionId,
      createdAt: date.toJSDate()
    })

    await this.eventRepository.create(eventEntity)
    this.logger.info({ message: `event created with id: ${eventEntity.id}` })

    await firstValueFrom(
       this.producer.publish(TopicsProducerEnum.START_SAGA, eventEntity)
    );
  }
}

export type OrderProducerCreateInput = z.infer<typeof OrderProducerCreateInputSchema>;
export type OrderProducerCreateOutput = void;
