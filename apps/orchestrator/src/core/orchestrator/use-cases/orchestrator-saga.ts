import { z } from 'zod';

import { IUsecase } from '@/utils/usecase';
import { ILoggerAdapter } from '@/infra/logger';

export const OrchestratorSagaInputSchema = z.any();

export class OrchestratorSagaUsecase implements IUsecase {
  constructor(private readonly logger: ILoggerAdapter) {}

  async execute(input: OrchestratorSagaInput): Promise<OrchestratorSagaOutput> {
    const model =  OrchestratorSagaInputSchema.parse(input)
    this.logger.info({ message: `............................${'orchestrator receive'}............................`, obj: { payload: input } })
    return model;
  }
}

export type OrchestratorSagaInput = z.infer<typeof OrchestratorSagaInputSchema>;
export type OrchestratorSagaOutput = void;
