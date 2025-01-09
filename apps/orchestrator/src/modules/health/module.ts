import { Module } from '@nestjs/common';
import { Service } from './controller';
import { LoggerModule } from '@/infra/logger';
import { SecretsModule } from '@/infra/secrets';

@Module({
  imports: [LoggerModule, SecretsModule],
  controllers: [Service],
  providers: [],
  exports: []
})
export class HealthModule {}
