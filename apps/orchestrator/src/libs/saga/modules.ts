import { Module } from '@nestjs/common';

import { ILoggerAdapter, LoggerModule } from '@/infra/logger';

import { ISagaOrchestratorLibAdapter } from './adapter';
import { SagaOrchestratorLibService } from './service';

@Module({
  imports: [LoggerModule],
  providers: [
    {
      provide: ISagaOrchestratorLibAdapter,
      useFactory(logger: ILoggerAdapter) {
        return new SagaOrchestratorLibService(logger);
      },
      inject: [ILoggerAdapter],
    },
  ],
  exports: [ISagaOrchestratorLibAdapter],
})
export class SagaLibModule {}
