import { Controller } from '@nestjs/common';
import { Ctx, KafkaContext, MessagePattern, Payload } from '@nestjs/microservices';
import { TopicsConsumerEnum } from '../utils/topics';

@Controller()
export class ConsumerController {
  @MessagePattern(TopicsConsumerEnum.FINISH_FAIL)
  async finishFail(@Payload() paylod: any, @Ctx() context: KafkaContext): Promise<void> {
    const { offset } = context.getMessage();
    const partition = context.getPartition();
    const topic = context.getTopic();
    const consumer = context.getConsumer();
    await consumer.commitOffsets([{ topic, partition, offset }])
    console.log("TopicsConsumerEnum.FINISH_FAIL received", paylod);
  }

  @MessagePattern(TopicsConsumerEnum.FINISH_SUCCESS)
  async notifySucess(@Payload() paylod: any, @Ctx() context: KafkaContext): Promise<void> {
    const { offset } = context.getMessage();
    const partition = context.getPartition();
    const topic = context.getTopic();
    const consumer = context.getConsumer();
    await consumer.commitOffsets([{ topic, partition, offset }])
    console.log("TopicsConsumerEnum.FINISH_SUCCESS received", paylod);
  }

  @MessagePattern(TopicsConsumerEnum.ORCHESTRATOR)
  async notifySuorchestrator(@Payload() paylod: any, @Ctx() context: KafkaContext): Promise<void> {
    const { offset } = context.getMessage();
    const partition = context.getPartition();
    const topic = context.getTopic();
    const consumer = context.getConsumer();
    await consumer.commitOffsets([{ topic, partition, offset }])
    console.log("TopicsConsumerEnum.ORCHESTRATOR received", paylod);
  }

  @MessagePattern(TopicsConsumerEnum.START_SAGA)
  async start(@Payload() paylod: any, @Ctx() context: KafkaContext): Promise<void> {
    const { offset } = context.getMessage();
    const partition = context.getPartition();
    const topic = context.getTopic();
    const consumer = context.getConsumer();
    await consumer.commitOffsets([{ topic, partition, offset }])
    console.log("TopicsConsumerEnum.START_SAGA", paylod);
  }

}
