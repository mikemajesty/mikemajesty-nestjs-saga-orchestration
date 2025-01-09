import { z } from 'zod';

import { ValidateSchema } from '@/utils/decorators';
import { IUsecase } from '@/utils/usecase';
import { ILoggerAdapter } from '@/infra/logger';
import { IOrhestratorStartSagaAdapter } from 'apps/orchestrator/src/modules/consumers/adapter';

export const OrchestratorStartSagaInputSchema = z.any();

export class OrchestratorStartSagaUsecase implements IOrhestratorStartSagaAdapter {

  constructor(private readonly logger: ILoggerAdapter) {}

  @ValidateSchema(OrchestratorStartSagaInputSchema)
  async execute(input: OrchestratorStartSagaInput): Promise<OrchestratorStartSagaOutput> {
    this.logger.info({ message: `............................${'start-saga receive'}............................`, obj: { payload: input } })
    return input;
  }
}

export type OrchestratorStartSagaInput = z.infer<typeof OrchestratorStartSagaInputSchema>;
export type OrchestratorStartSagaOutput = void;
