import { Kafka } from 'kafkajs';
import { Controller, UseFilters } from '@nestjs/common';
import { Ctx, KafkaContext, MessagePattern, Payload, RpcException, Transport } from '@nestjs/microservices';
import { TopicsConsumerEnum } from '../../utils/topics';
import { IPaymentRealizeAdapter, IPaymentRefundAdapter } from '../payment/adapter';
import { ApiBadRequestException, ApiNotFoundException } from '@/utils/exception';

@Controller()
export class ConsumerController {
  constructor(private readonly refundUsecase: IPaymentRefundAdapter, private readonly realizeUsecase: IPaymentRealizeAdapter) {}

  @MessagePattern(TopicsConsumerEnum.PAYMENT_FAIL)
  async failInventory(@Payload() paylod: any, @Ctx() context: KafkaContext): Promise<void> {
    const { offset } = context.getMessage();
    const partition = context.getPartition();
    const topic = context.getTopic();
    const consumer = context.getConsumer();
    await this.refundUsecase.execute(paylod)
    await consumer.commitOffsets([{ topic, partition, offset }])
    console.log("TopicsConsumerEnum.PAYMENT_FAIL received", paylod);
  }

  @MessagePattern(TopicsConsumerEnum.PAYMENT_SUCCESS, Transport.KAFKA)
  async successInventory(@Payload() paylod: any, @Ctx() context: KafkaContext): Promise<void> {
    try {
      await this.realizeUsecase.execute(paylod)
      console.log("TopicsConsumerEnum.PAYMENT_SUCCESS received", paylod);
    } catch (error) {
      console.log("errao", error);
    }
  }
}
