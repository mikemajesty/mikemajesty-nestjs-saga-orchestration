import { EventEntity } from '@/entities/event';
import { ILoggerAdapter } from '@/infra/logger';

import { IOrchestratorSagaAdapter } from '../../consumer/adapter';
import { IProducerAdapter } from '../../infra/producer/adapter';
import { ISagaOrchestratorLibAdapter } from '../../libs/saga/adapter';

export class OrchestratorSagaUsecase implements IOrchestratorSagaAdapter {
  constructor(
    private readonly logger: ILoggerAdapter,
    private readonly producer: IProducerAdapter,
    private readonly orchestrator: ISagaOrchestratorLibAdapter,
  ) {}

  async execute(input: OrchestratorSagaInput): Promise<OrchestratorSagaOutput> {
    console.log('input', input);
    const entity = new EventEntity(input);
    let topic = '';
    try {
      topic = this.getTopic(entity);
      this.logger.info({
        message: `..............SAGA_CONTINUING_FOR_EVENT_EVENT: ${entity.id}.................................`,
      });
    } catch (error) {
      error.context = OrchestratorSagaUsecase.name;
      this.logger.error(error);
    } finally {
      await this.producer.publish(entity, topic);
    }
  }

  private getTopic(event: EventEntity) {
    return this.orchestrator.getNextTopic(event);
  }
}

export type OrchestratorSagaInput = EventEntity;
export type OrchestratorSagaOutput = void;
