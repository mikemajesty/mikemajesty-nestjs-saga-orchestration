import { EventEntity } from '@/entities/event';
import { HistoricEntity } from '@/entities/historic';
import { ILoggerAdapter } from '@/infra/logger';
import { DateUtils } from '@/utils/date';

import { IOrchestratorFinishFailAdapter } from '../../consumer/adapter';
import { IProducerAdapter } from '../../infra/producer/adapter';
import {
  EventSource,
  SagaStatus,
  TopicsProducerEnum,
} from '../../utils/topics';

export class OrchestratorFinishFailUsecase
  implements IOrchestratorFinishFailAdapter
{
  constructor(
    private readonly logger: ILoggerAdapter,
    private readonly producer: IProducerAdapter,
  ) {}

  private readonly SOURCE = 'ORCHESTRATOR';
  async execute(
    input: OrchestratorFinishFailInput,
  ): Promise<OrchestratorFinishFailOutput> {
    const entity = this.getEntity(input);
    try {
      entity.source = EventSource.ORCHESTRATOR;
      entity.status = SagaStatus.FAIL;
      this.addHistoric(entity, `Saga finished with errors.`);
      this.logger.info({
        message: `.......................SAGA_FINISHED_WITH_ERRORS.........................`,
      });
    } catch (error) {
      error.context = OrchestratorFinishFailUsecase.name;
      this.logger.error(error);
    } finally {
      await this.producer.publish(entity, TopicsProducerEnum.NOTIFY_ENDING);
    }
  }

  private getEntity(input: EventEntity) {
    return new EventEntity(input);
  }

  private addHistoric(input: EventEntity, message: string) {
    const historic = new HistoricEntity({
      message,
      source: this.SOURCE,
      status: input.status,
      createdAt: DateUtils.getJSDate(),
    });

    input.eventHistoric.push(historic);
  }
}

export type OrchestratorFinishFailInput = EventEntity;
export type OrchestratorFinishFailOutput = void;
