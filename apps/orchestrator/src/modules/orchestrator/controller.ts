import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TopicsConsumerEnum } from '../../utils/topics';

@Controller()
export class OrchestratorController {

  @MessagePattern(TopicsConsumerEnum.FINISH_FAIL)
  async finishFail(@Payload() paylod: any): Promise<void> {
    console.log("TopicsConsumerEnum.FINISH_FAIL received", paylod);
  }

  @MessagePattern(TopicsConsumerEnum.FINISH_SUCCESS)
  async notifySucess(@Payload() paylod: any): Promise<void> {
    console.log("TopicsConsumerEnum.FINISH_SUCCESS received", paylod);
  }

  @MessagePattern(TopicsConsumerEnum.ORCHESTRATOR)
  async notifySuorchestrator(@Payload() paylod: any): Promise<void> {
    console.log("TopicsConsumerEnum.ORCHESTRATOR received", paylod);
  }

  @MessagePattern(TopicsConsumerEnum.START_SAGA)
  async start(@Payload() paylod: any): Promise<void> {
    console.log("TopicsConsumerEnum.START_SAGA", paylod);
  }

}
