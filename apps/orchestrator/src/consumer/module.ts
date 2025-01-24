import { Module } from '@nestjs/common';

import { OrchestratorFinishFailUsecase } from '@/core/use-cases/orchestrator-finish-fail';
import { OrchestratorFinishSuccessUsecase } from '@/core/use-cases/orchestrator-finish-success';
import { OrchestratorSagaUsecase } from '@/core/use-cases/orchestrator-saga';
import { OrchestratorStartSagaUsecase } from '@/core/use-cases/orchestrator-start-saga';
import { ILoggerAdapter, LoggerModule } from '@/infra/logger';

import { KafkaModule } from '../infra/kafka/module';
import { IProducerAdapter } from '../infra/producer/adapter';
import { ProducerModule } from '../infra/producer/module';
import { ISagaOrchestratorLibAdapter } from '../libs/saga/adapter';
import { SagaLibModule } from '../libs/saga/modules';
import {
  IOrchestratorFinishFailAdapter,
  IOrchestratorFinishSuccessAdapter,
  IOrchestratorSagaAdapter,
  IOrchestratorStartSagaAdapter,
} from './adapter';
import { ConsumerController } from './controller';

@Module({
  imports: [
    KafkaModule,
    LoggerModule,
    ProducerModule,
    SagaLibModule,
    SagaLibModule,
  ],
  controllers: [ConsumerController],
  providers: [
    {
      provide: IOrchestratorSagaAdapter,
      useFactory(
        logger: ILoggerAdapter,
        producer: IProducerAdapter,
        orchestrator: ISagaOrchestratorLibAdapter,
      ) {
        return new OrchestratorSagaUsecase(logger, producer, orchestrator);
      },
      inject: [ILoggerAdapter, IProducerAdapter, ISagaOrchestratorLibAdapter],
    },
    {
      provide: IOrchestratorFinishFailAdapter,
      useFactory(logger: ILoggerAdapter, producer: IProducerAdapter) {
        return new OrchestratorFinishFailUsecase(logger, producer);
      },
      inject: [ILoggerAdapter, IProducerAdapter],
    },
    {
      provide: IOrchestratorFinishSuccessAdapter,
      useFactory(logger: ILoggerAdapter, producer: IProducerAdapter) {
        return new OrchestratorFinishSuccessUsecase(logger, producer);
      },
      inject: [ILoggerAdapter, IProducerAdapter],
    },
    {
      provide: IOrchestratorStartSagaAdapter,
      useFactory(
        logger: ILoggerAdapter,
        producer: IProducerAdapter,
        orchestrator: ISagaOrchestratorLibAdapter,
      ) {
        return new OrchestratorStartSagaUsecase(logger, producer, orchestrator);
      },
      inject: [ILoggerAdapter, IProducerAdapter, ISagaOrchestratorLibAdapter],
    },
  ],
  exports: [
    IOrchestratorSagaAdapter,
    IOrchestratorFinishFailAdapter,
    IOrchestratorFinishSuccessAdapter,
    IOrchestratorStartSagaAdapter,
  ],
})
export class ConsumerModule {}
