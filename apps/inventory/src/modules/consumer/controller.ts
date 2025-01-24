import { Controller } from '@nestjs/common';
import {
  Ctx,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';

import { TopicsConsumerEnum } from '../../utils/topics';
import { IInventoryRollbackAdapter, IInventoryUpdateAdapter } from './adapter';

@Controller()
export class ConsumerController {
  constructor(
    private readonly rollbackUsecase: IInventoryRollbackAdapter,
    private readonly successUsecase: IInventoryUpdateAdapter,
  ) {}
  @MessagePattern(TopicsConsumerEnum.INVENTORY_FAIL)
  async failInventory(
    @Payload() paylod: any,
    @Ctx() context: KafkaContext,
  ): Promise<void> {
    const { offset } = context.getMessage();
    const partition = context.getPartition();
    const topic = context.getTopic();
    const consumer = context.getConsumer();
    await this.rollbackUsecase.execute(paylod);
    await consumer.commitOffsets([{ topic, partition, offset }]);
  }

  @MessagePattern(TopicsConsumerEnum.INVENTORY_SUCCESS)
  async successInventory(
    @Payload() paylod: any,
    @Ctx() context: KafkaContext,
  ): Promise<void> {
    const { offset } = context.getMessage();
    const partition = context.getPartition();
    const topic = context.getTopic();
    const consumer = context.getConsumer();
    await this.successUsecase.execute(paylod);
    await consumer.commitOffsets([{ topic, partition, offset }]);
  }
}
