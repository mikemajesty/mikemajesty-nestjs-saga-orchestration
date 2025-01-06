import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/module';
import { SecretsModule } from '@/infra/secrets';
import { LoggerModule } from '@/infra/logger';
import { DatabaseModule } from './infra/databse';
import { ClientsModule, Transport } from '@nestjs/microservices';
import 'dotenv/config';
import { KafkaModule } from './infra/kafka/modules';

@Module({
  imports: [HealthModule, SecretsModule, LoggerModule, DatabaseModule, KafkaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
