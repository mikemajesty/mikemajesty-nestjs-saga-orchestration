import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TopicsConsumerEnum } from '../utils/topics';

@Controller()
export class ConsumerController {

  @MessagePattern(TopicsConsumerEnum.PAYMENT_FAIL)
  async failInventory(@Payload() paylod: any): Promise<void> {
    console.log("TopicsConsumerEnum.PAYMENT_FAIL received", paylod);
  }

  @MessagePattern(TopicsConsumerEnum.PAYMENT_SUCCESS)
  async successInventory(@Payload() paylod: any): Promise<void> {
    console.log("TopicsConsumerEnum.PAYMENT_SUCCESS received", paylod);
  }
}
