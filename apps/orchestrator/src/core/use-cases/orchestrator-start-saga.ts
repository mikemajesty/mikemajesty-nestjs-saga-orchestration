import { EventEntity } from '@/entities/event';
import { HistoricEntity } from '@/entities/historic';
import { ILoggerAdapter } from '@/infra/logger';
import { DateUtils } from '@/utils/date';

import { IOrchestratorStartSagaAdapter } from '../../consumer/adapter';
import { IProducerAdapter } from '../../infra/producer/adapter';
import { ISagaOrchestratorLibAdapter } from '../../libs/saga/adapter';
import { EventSource, SagaStatus } from '../../utils/topics';

export class OrchestratorStartSagaUsecase
  implements IOrchestratorStartSagaAdapter
{
  constructor(
    private readonly logger: ILoggerAdapter,
    private readonly producer: IProducerAdapter,
    private readonly orchestrator: ISagaOrchestratorLibAdapter,
  ) {}

  private readonly SOURCE = 'ORCHESTRATOR';

  async execute(
    input: OrchestratorStartSagaInput,
  ): Promise<OrchestratorStartSagaOutput> {
    const entity = new EventEntity(input);
    let topic = '';
    try {
      entity.source = EventSource.ORCHESTRATOR;
      entity.status = SagaStatus.SUCCESS;
      topic = this.getTopic(entity);
      this.addHistoric(entity, 'Saga started.');
      this.logger.info({
        message: `.......................SAGA_STARTED..........................`,
      });
    } catch (error) {
      error.context = OrchestratorStartSagaUsecase.name;
      this.logger.error(error);
    } finally {
      await this.producer.publish(entity, topic);
    }
  }

  private getTopic(event: EventEntity) {
    return this.orchestrator.getNextTopic(event).toString();
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

export type OrchestratorStartSagaInput = EventEntity;
export type OrchestratorStartSagaOutput = void;
