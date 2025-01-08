
import { IUsecase } from "@/utils/usecase";
import { OrchestratorStartSagaInput, OrchestratorStartSagaOutput } from "../../core/orchestrator/use-cases/orchestrator-start-saga";
import { OrchestratorSagaInput, OrchestratorSagaOutput } from "../../core/orchestrator/use-cases/orchestrator-saga";

export abstract class IOrhestratorStartSagaAdapter implements IUsecase {
  abstract execute(input: OrchestratorStartSagaInput): Promise<OrchestratorStartSagaOutput>;
}

export abstract class IOrhestratorSagaAdapter implements IUsecase {
  abstract execute(input: OrchestratorSagaInput): Promise<OrchestratorSagaOutput>;
}