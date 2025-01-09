import { Module } from '@nestjs/common';

import { OrchestratorController } from './controller';
import { KafkaModule } from '../../infra/kafka/module';

@Module({
  imports: [KafkaModule],
  controllers: [OrchestratorController],
  providers: [],
})
export class OrchestratorConsumerModule {}
