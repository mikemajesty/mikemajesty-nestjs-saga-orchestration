import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, Transport } from '@nestjs/microservices';

import { TopicsConsumerEnum } from '../../utils/topics';
import {
  IPaymentRealizeAdapter,
  IPaymentRefundAdapter,
} from '../payment/adapter';
import { EventEntity } from './../../../../../entities/event';

@Controller()
export class ConsumerController {
  constructor(
    private readonly refundUsecase: IPaymentRefundAdapter,
    private readonly realizeUsecase: IPaymentRealizeAdapter,
  ) {}

  @MessagePattern(TopicsConsumerEnum.PAYMENT_FAIL)
  async failInventory(@Payload() paylod: EventEntity): Promise<void> {
    await this.refundUsecase.execute(paylod);
  }

  @MessagePattern(TopicsConsumerEnum.PAYMENT_SUCCESS, Transport.KAFKA)
  async successInventory(@Payload() paylod: EventEntity): Promise<void> {
    await this.realizeUsecase.execute(paylod);
  }
}
