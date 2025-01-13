import { z } from 'zod';

import { IUsecase } from '@/utils/usecase';
import { ILoggerAdapter } from '@/infra/logger';

export const OrchestratorStartSagaInputSchema = z.any();

export class OrchestratorStartSagaUsecase implements IUsecase {

  constructor(private readonly logger: ILoggerAdapter) {}

  async execute(input: OrchestratorStartSagaInput): Promise<OrchestratorStartSagaOutput> {
    const model = OrchestratorStartSagaInputSchema.parse(input)
    this.logger.info({ message: `............................${'start-saga receive'}............................`, obj: { payload: input } })
    return model;
  }
}

export type OrchestratorStartSagaInput = z.infer<typeof OrchestratorStartSagaInputSchema>;
export type OrchestratorStartSagaOutput = void;
