import { ClientKafka } from '@nestjs/microservices';
import { Module } from '@nestjs/common';
import { IProducerAdapter } from './adapter';
import { ProducerService } from './service';
import { KafkaModule } from '../kafka/module';
import { IKafkaAdapter } from '../kafka/adapter';
import { ILoggerAdapter, LoggerModule } from '@/infra/logger';


@Module({
  imports: [KafkaModule, LoggerModule],
  providers: [{
    provide: IProducerAdapter,
    useFactory(kafka: IKafkaAdapter, logger: ILoggerAdapter) {
      return new ProducerService(kafka, logger)
    },
    inject: [IKafkaAdapter, ILoggerAdapter]
  }],
  exports: [IProducerAdapter]
})
export class ProducerModule { }
