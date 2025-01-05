import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/module';
import { SecretsModule } from '@/infra/secrets';
import { LoggerModule } from '@/infra/logger';

@Module({
  imports: [HealthModule, SecretsModule, LoggerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
