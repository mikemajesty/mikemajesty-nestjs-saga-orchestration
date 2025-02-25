import { IProducerAdapter } from 'apps/order/src/infra/producer/adapter';
import { TopicsProducerEnum } from 'apps/order/src/utils/topics';
import { z } from 'zod';

import { IEventRepository } from '@/core/event/repository/event';
import { ILoggerAdapter } from '@/infra/logger';
import { DateUtils } from '@/utils/date';
import { UUIDUtils } from '@/utils/uuid';

import { IOrderProducerCreateAdapter } from '../../../modules/order/adapter';
import { EventEntity } from '../../event/entity/event';
import { OrderEntity } from '../entity/order';
import {
  OrderProductEntity,
  OrderProductEntitySchema,
} from '../entity/order-product';
import { IOrderRepository } from '../repository/order';

export const OrderProducerCreateInputSchema = z.object({
  products: z.array(OrderProductEntitySchema).min(1),
  trasactionId: z.string().nullish(),
  createdAt: z.date().or(z.string()).nullish().optional(),
});

export class OrderProducerCreateUsecase implements IOrderProducerCreateAdapter {
  constructor(
    private readonly producer: IProducerAdapter,
    private readonly logger: ILoggerAdapter,
    private readonly orderRepository: IOrderRepository,
    private readonly eventRepository: IEventRepository,
  ) {}

  async execute(input: OrderProducerCreateInput): Promise<any> {
    try {
      const model = OrderProducerCreateInputSchema.parse(input);
      const date = DateUtils.getDate();
      const products = model.products.map((p) => new OrderProductEntity(p));
      const transactionId = `${DateUtils.date.now().toMillis()}_${UUIDUtils.create()}`;

      this.logger.setGlobalParameters({ traceId: transactionId });

      this.logger.info({
        message: `saga: ${TopicsProducerEnum.START_SAGA} started with traceId: ${transactionId}`,
      });

      const orderEntity = new OrderEntity({
        products,
        transactionId,
        createdAt: date.toJSDate(),
      });

      await this.orderRepository.create(orderEntity);
      this.logger.info({ message: `order created with id: ${orderEntity.id}` });

      const eventEntity = new EventEntity({
        orderId: orderEntity.id,
        payload: orderEntity,
        transactionId: orderEntity.transactionId,
        createdAt: date.toJSDate(),
      });

      await this.eventRepository.create(eventEntity);
      this.logger.info({ message: `event created with id: ${eventEntity.id}` });

      await this.producer.publish(TopicsProducerEnum.START_SAGA, eventEntity);
    } catch (error) {
      error.context = OrderProducerCreateUsecase.name;
      error.parameters = {
        info: 'error trying to create order',
      };
      this.logger.error(error);
    }
  }
}

export type OrderProducerCreateInput = z.infer<
  typeof OrderProducerCreateInputSchema
>;
export type OrderProducerCreateOutput = void;
