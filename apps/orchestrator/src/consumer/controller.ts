import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { EventEntity } from '@/entities/event';

import { TopicsConsumerEnum } from '../utils/topics';
import {
  IOrchestratorFinishFailAdapter,
  IOrchestratorFinishSuccessAdapter,
  IOrchestratorSagaAdapter,
  IOrchestratorStartSagaAdapter,
} from './adapter';

@Controller()
export class ConsumerController {
  constructor(
    private readonly orchestratorSaga: IOrchestratorSagaAdapter,
    private readonly failSaga: IOrchestratorFinishFailAdapter,
    private readonly successSaga: IOrchestratorFinishSuccessAdapter,
    private readonly startSaga: IOrchestratorStartSagaAdapter,
  ) {}

  @MessagePattern(TopicsConsumerEnum.FINISH_FAIL)
  async fail(@Payload() paylod: EventEntity): Promise<void> {
    await this.failSaga.execute(paylod);
  }

  @MessagePattern(TopicsConsumerEnum.FINISH_SUCCESS)
  async success(@Payload() paylod: EventEntity): Promise<void> {
    await this.successSaga.execute(paylod);
  }

  @MessagePattern(TopicsConsumerEnum.ORCHESTRATOR)
  async orchestrator(@Payload() paylod: EventEntity): Promise<void> {
    await this.orchestratorSaga.execute(paylod);
  }

  @MessagePattern(TopicsConsumerEnum.START_SAGA)
  async start(@Payload() paylod: EventEntity): Promise<void> {
    await this.startSaga.execute(paylod);
  }
}
