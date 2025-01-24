import {
  OrchestratorFinishFailInput,
  OrchestratorFinishFailOutput,
} from '@/core/use-cases/orchestrator-finish-fail';
import {
  OrchestratorFinishSuccessInput,
  OrchestratorFinishSuccessOutput,
} from '@/core/use-cases/orchestrator-finish-success';
import {
  OrchestratorSagaInput,
  OrchestratorSagaOutput,
} from '@/core/use-cases/orchestrator-saga';
import {
  OrchestratorStartSagaInput,
  OrchestratorStartSagaOutput,
} from '@/core/use-cases/orchestrator-start-saga';

export abstract class IOrchestratorFinishFailAdapter {
  abstract execute(
    event: OrchestratorFinishFailInput,
  ): Promise<OrchestratorFinishFailOutput>;
}

export abstract class IOrchestratorFinishSuccessAdapter {
  abstract execute(
    event: OrchestratorFinishSuccessInput,
  ): Promise<OrchestratorFinishSuccessOutput>;
}

export abstract class IOrchestratorSagaAdapter {
  abstract execute(
    event: OrchestratorSagaInput,
  ): Promise<OrchestratorSagaOutput>;
}

export abstract class IOrchestratorStartSagaAdapter {
  abstract execute(
    event: OrchestratorStartSagaInput,
  ): Promise<OrchestratorStartSagaOutput>;
}
