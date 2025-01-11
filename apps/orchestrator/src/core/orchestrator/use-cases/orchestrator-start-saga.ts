import { z } from 'zod';

import { ValidateSchema } from '@/utils/decorators';
import { IUsecase } from '@/utils/usecase';
import { ILoggerAdapter } from '@/infra/logger';

export const OrchestratorStartSagaInputSchema = z.any();

export class OrchestratorStartSagaUsecase implements IUsecase {

  constructor(private readonly logger: ILoggerAdapter) {}

  @ValidateSchema(OrchestratorStartSagaInputSchema)
  async execute(input: OrchestratorStartSagaInput): Promise<OrchestratorStartSagaOutput> {
    this.logger.info({ message: `............................${'start-saga receive'}............................`, obj: { payload: input } })
    return input;
  }
}

export type OrchestratorStartSagaInput = z.infer<typeof OrchestratorStartSagaInputSchema>;
export type OrchestratorStartSagaOutput = void;
