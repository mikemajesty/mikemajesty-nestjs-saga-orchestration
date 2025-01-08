import { Module, OnModuleInit } from '@nestjs/common';
import { IOrhestratorSagaAdapter, IOrhestratorStartSagaAdapter } from './adapter';
import { OrchestratorStartSagaUsecase } from '../../core/orchestrator/use-cases/orchestrator-start-saga';
import { ILoggerAdapter, LoggerModule } from '@/infra/logger';
import { ConsumerModule } from '../../infra/consumer/modules';
import { IConsumerAdapter } from '../../infra/consumer/adapter';
import { TopicsEnum } from '../../utils/topics';
import { OrchestratorSagaUsecase } from '../../core/orchestrator/use-cases/orchestrator-saga';

@Module({
  imports: [ConsumerModule, LoggerModule],
  controllers: [],
  providers: [
    {
      provide: IOrhestratorStartSagaAdapter,
      useFactory(logger: ILoggerAdapter) {
        return new OrchestratorStartSagaUsecase(logger)
      },
      inject: [ILoggerAdapter]
    },
    {
      provide: IOrhestratorSagaAdapter,
      useFactory(logger: ILoggerAdapter) {
        return new OrchestratorSagaUsecase(logger)
      },
      inject: [ILoggerAdapter]
    }
  ],
  exports: [IOrhestratorStartSagaAdapter, IOrhestratorSagaAdapter]
})
export class ConsumeModule implements OnModuleInit {
  constructor(
    private readonly consumer: IConsumerAdapter,
    private readonly startSaga: IOrhestratorStartSagaAdapter,
    private readonly orchestratorSaga: IOrhestratorSagaAdapter,
    private readonly logger: ILoggerAdapter
  ) { }

  onModuleInit() {
    const startSagaTopic = [TopicsEnum.START_SAGA, TopicsEnum.BASE_ORCHESTRATOR]
    this.logger.info({ message: "======initializer [orchestrator] consumer======", obj: { topics: startSagaTopic } })
    this.consumer.consume({ topics: startSagaTopic, fromBeginning: true }, {
      eachMessage: async ({ message }) => {
        await this.startSaga.execute(message.value.toString())
      }
    })

    const orchestratorSagaTopic = [TopicsEnum.BASE_ORCHESTRATOR, TopicsEnum.START_SAGA]
    this.logger.info({ message: "======initializer [orchestrator] consumer======", obj: { topics: orchestratorSagaTopic } })
    this.consumer.consume({ topics: orchestratorSagaTopic, fromBeginning: true }, {
      eachMessage: async ({ message }) => {
        await this.orchestratorSaga.execute(message.value.toString())
      }
    })
  }
}
