import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/module';
import { SecretsModule } from '@/infra/secrets';
import { LoggerModule } from '@/infra/logger';
import { DatabaseModule } from './infra/databse';
import { OrderModule } from './modules/order/module';

@Module({
  imports: [HealthModule, SecretsModule, LoggerModule, DatabaseModule, OrderModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
