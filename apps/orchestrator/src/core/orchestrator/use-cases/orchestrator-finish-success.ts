import { z } from 'zod';

import { IUsecase } from '@/utils/usecase';
import { ILoggerAdapter } from '@/infra/logger';

export const OrchestratorFinishSuccessInputSchema = z.any()

export class OrchestratorFinishSuccessUsecase implements IUsecase {
  constructor(private readonly logger: ILoggerAdapter) {}

  async execute(input: OrchestratorFinishSuccessInput): Promise<OrchestratorFinishSuccessOutput> {
    const model = OrchestratorFinishSuccessInputSchema.parse(input)
    this.logger.info({ message: `............................${"OrchestratorFinishSuccessUsecase."}............................`, obj: { payload: input } })
    return model;
  }
}

export type OrchestratorFinishSuccessInput = z.infer<typeof OrchestratorFinishSuccessInputSchema>;
export type OrchestratorFinishSuccessOutput = void;
