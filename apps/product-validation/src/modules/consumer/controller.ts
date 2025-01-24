import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { EventEntity } from '@/entities/event';

import { TopicsConsumerEnum } from '../../utils/topics';
import { IValidateRollbackAdapter, IValidationSuccessAdapter } from './adapter';

@Controller()
export class ConsumerController {
  constructor(
    private readonly success: IValidationSuccessAdapter,
    private readonly fail: IValidateRollbackAdapter,
  ) {}

  @MessagePattern(TopicsConsumerEnum.PRODUCT_VALIDATION_FAIL)
  async failInventory(@Payload() paylod: EventEntity): Promise<void> {
    await this.fail.execute(paylod);
  }

  @MessagePattern(TopicsConsumerEnum.PRODUCT_VALIDATION_SUCCESS)
  async successInventory(@Payload() paylod: EventEntity): Promise<void> {
    await this.success.execute(paylod);
  }
}
