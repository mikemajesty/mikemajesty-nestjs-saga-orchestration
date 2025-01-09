import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TopicsConsumerEnum } from '../../utils/topics';

@Controller()
export class ProductValidationController {

  @MessagePattern(TopicsConsumerEnum.PRODUCT_VALIDATION_FAIL)
  async failInventory(@Payload() paylod: any): Promise<void> {
    console.log("TopicsConsumerEnum.PRODUCT_VALIDATION_FAIL received", paylod);
  }

  @MessagePattern(TopicsConsumerEnum.PRODUCT_VALIDATION_SUCCESS)
  async successInventory(@Payload() paylod: any): Promise<void> {
    console.log("TopicsConsumerEnum.PRODUCT_VALIDATION_SUCCESS received", paylod);
  }
}
