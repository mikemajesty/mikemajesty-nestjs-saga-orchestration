import { Controller } from '@nestjs/common';
import { Ctx, KafkaContext, MessagePattern, Payload } from '@nestjs/microservices';
import { TopicsConsumerEnum } from '../../utils/topics';
import { IValidateRollbackAdapter, IValidationSuccessAdapter } from './adapter';

@Controller()
export class ConsumerController {

  constructor(
    private readonly success: IValidationSuccessAdapter,
    private readonly fail: IValidateRollbackAdapter
  ) {
  }

  @MessagePattern(TopicsConsumerEnum.PRODUCT_VALIDATION_FAIL)
  async failInventory(@Payload() paylod: any, @Ctx() context: KafkaContext): Promise<void> {
    const { offset } = context.getMessage();
    const partition = context.getPartition();
    const topic = context.getTopic();
    const consumer = context.getConsumer();
    await this.fail.execute(paylod)
    await consumer.commitOffsets([{ topic, partition, offset }])
  }

  @MessagePattern(TopicsConsumerEnum.PRODUCT_VALIDATION_SUCCESS)
  async successInventory(@Payload() paylod: any, @Ctx() context: KafkaContext): Promise<void> {
    const { offset } = context.getMessage();
    const partition = context.getPartition();
    const topic = context.getTopic();
    const consumer = context.getConsumer();
    await this.success.execute(paylod)
    await consumer.commitOffsets([{ topic, partition, offset }])
  }
}
