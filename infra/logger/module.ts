import { Module } from '@nestjs/common';

import { ISecretsAdapter, SecretsModule } from '@/infra/secrets';

import { ILoggerAdapter } from './adapter';
import { LoggerService } from './service';

@Module({
  imports: [SecretsModule],
  providers: [
    {
      provide: ILoggerAdapter,
      useFactory: async () => {
        const logger = new LoggerService();
        logger.connect();
        return logger;
      },
      inject: [ISecretsAdapter],
    },
  ],
  exports: [ILoggerAdapter],
})
export class LoggerModule {}
