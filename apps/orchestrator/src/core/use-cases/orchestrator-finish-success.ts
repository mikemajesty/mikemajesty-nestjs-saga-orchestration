import { EventEntity } from '@/entities/event';
import { HistoricEntity } from '@/entities/historic';
import { ILoggerAdapter } from '@/infra/logger';
import { DateUtils } from '@/utils/date';

import { IOrchestratorFinishSuccessAdapter } from '../../consumer/adapter';
import { IProducerAdapter } from '../../infra/producer/adapter';
import {
  EventSource,
  SagaStatus,
  TopicsProducerEnum,
} from '../../utils/topics';

export class OrchestratorFinishSuccessUsecase
  implements IOrchestratorFinishSuccessAdapter
{
  constructor(
    private readonly logger: ILoggerAdapter,
    private readonly producer: IProducerAdapter,
  ) {}

  private readonly SOURCE = 'ORCHESTRATOR';

  async execute(
    input: OrchestratorFinishSuccessInput,
  ): Promise<OrchestratorFinishSuccessOutput> {
    const entity = new EventEntity(input);
    try {
      entity.source = EventSource.ORCHESTRATOR;
      entity.status = SagaStatus.SUCCESS;
      this.addHistoric(entity, `Saga finished successfully.`);
      this.logger.info({
        message: `.......................SAGA_FINISHED_SUCCESSFULLY.........................`,
      });
    } catch (error) {
      error.context = OrchestratorFinishSuccessUsecase.name;
      this.logger.error(error);
    } finally {
      await this.producer.publish(entity, TopicsProducerEnum.NOTIFY_ENDING);
    }
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

export type OrchestratorFinishSuccessInput = EventEntity;
export type OrchestratorFinishSuccessOutput = void;
