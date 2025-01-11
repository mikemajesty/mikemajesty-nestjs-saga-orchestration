import { Controller } from '@nestjs/common';
import { Ctx, KafkaContext, MessagePattern, Payload } from '@nestjs/microservices';
import { TopicsConsumerEnum } from '../utils/topics';

@Controller()
export class ConsumerController {

  @MessagePattern(TopicsConsumerEnum.PAYMENT_FAIL)
  async failInventory(@Payload() paylod: any, @Ctx() context: KafkaContext): Promise<void> {
    const { offset } = context.getMessage();
    const partition = context.getPartition();
    const topic = context.getTopic();
    const consumer = context.getConsumer();
    await consumer.commitOffsets([{ topic, partition, offset }])
    console.log("TopicsConsumerEnum.PAYMENT_FAIL received", paylod);
  }

  @MessagePattern(TopicsConsumerEnum.PAYMENT_SUCCESS)
  async successInventory(@Payload() paylod: any, @Ctx() context: KafkaContext): Promise<void> {
    const { offset } = context.getMessage();
    const partition = context.getPartition();
    const topic = context.getTopic();
    const consumer = context.getConsumer();
    await consumer.commitOffsets([{ topic, partition, offset }])
    console.log("TopicsConsumerEnum.PAYMENT_SUCCESS received", paylod);
  }
}
