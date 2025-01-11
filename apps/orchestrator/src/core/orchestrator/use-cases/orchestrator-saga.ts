import { z } from 'zod';

import { ValidateSchema } from '@/utils/decorators';
import { IUsecase } from '@/utils/usecase';
import { ILoggerAdapter } from '@/infra/logger';

export const OrchestratorSagaInputSchema = z.any();

export class OrchestratorSagaUsecase implements IUsecase {
  constructor(private readonly logger: ILoggerAdapter) {}

  @ValidateSchema(OrchestratorSagaInputSchema)
  async execute(input: OrchestratorSagaInput): Promise<OrchestratorSagaOutput> {
    this.logger.info({ message: `............................${'orchestrator receive'}............................`, obj: { payload: input } })
    return input;
  }
}

export type OrchestratorSagaInput = z.infer<typeof OrchestratorSagaInputSchema>;
export type OrchestratorSagaOutput = void;
