import { Module } from '@nestjs/common';
import { SecretsModule } from '@/infra/secrets';
import { LoggerModule } from '@/infra/logger';
import { KafkaModule } from './infra/kafka/module';
import { ProducerModule } from './infra/producer/module';
import { OrchestratorConsumerModule } from './modules/orchestrator/module';

@Module({
  imports: [SecretsModule, LoggerModule, KafkaModule, ProducerModule, OrchestratorConsumerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
