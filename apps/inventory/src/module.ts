import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/module';
import { SecretsModule } from '@/infra/secrets';
import { LoggerModule } from '@/infra/logger';
import { DatabaseModule } from './infra/database';

@Module({
  imports: [HealthModule, SecretsModule, LoggerModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
