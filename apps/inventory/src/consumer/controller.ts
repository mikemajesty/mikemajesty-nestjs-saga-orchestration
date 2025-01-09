import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TopicsConsumerEnum } from '../utils/topics';

@Controller()
export class ConsumerController {

  @MessagePattern(TopicsConsumerEnum.INVENTORY_FAIL)
  async failInventory(@Payload() paylod: any): Promise<void> {
    console.log("TopicsConsumerEnum.INVENTORY_FAIL received", paylod);
  }

  @MessagePattern(TopicsConsumerEnum.INVENTORY_SUCCESS)
  async successInventory(@Payload() paylod: any): Promise<void> {
    console.log("TopicsConsumerEnum.INVENTORY_SUCCESS received", paylod);
  }
}
