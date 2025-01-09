import { z } from 'zod';

import { ValidateSchema } from '@/utils/decorators';
import { IUsecase } from '@/utils/usecase';
import { ILoggerAdapter } from '@/infra/logger';
import { IOrchestratorFinishSuccessAdapter } from 'apps/orchestrator/src/modules/consumers/adapter';


export const OrchestratorFinishSuccessInputSchema = z.any()

export class OrchestratorFinishSuccessUsecase implements IOrchestratorFinishSuccessAdapter {
  constructor(private readonly logger: ILoggerAdapter) {}

  @ValidateSchema(OrchestratorFinishSuccessInputSchema)
  async execute(input: OrchestratorFinishSuccessInput): Promise<OrchestratorFinishSuccessOutput> {
    this.logger.info({ message: `............................${"OrchestratorFinishSuccessUsecase."}............................`, obj: { payload: input } })
    return input;
  }
}

export type OrchestratorFinishSuccessInput = z.infer<typeof OrchestratorFinishSuccessInputSchema>;
export type OrchestratorFinishSuccessOutput = void;
