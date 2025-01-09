import { Module, OnModuleInit } from '@nestjs/common';
import { IOrderEndingSagaAdapter } from './adapter';
import { OrderFinishSagaUsecase } from '../../core/order/use-cases/order-ending-saga';
import { ILoggerAdapter, LoggerModule } from '@/infra/logger';
import { NotifyEndingModule } from '../../infra/consumers/modules';
import { IConsumerAdapter } from '../../infra/consumers/adapter';
import { TopicsEnum } from '../../utils/topics';

@Module({
  imports: [NotifyEndingModule, LoggerModule],
  controllers: [],
  providers: [{
    provide: IOrderEndingSagaAdapter,
    useFactory(logger: ILoggerAdapter) {
      return new OrderFinishSagaUsecase(logger)
    },
    inject: [ILoggerAdapter]
  }]
})
export class ConsumeModule implements OnModuleInit {
  constructor(private readonly consumer: IConsumerAdapter, private readonly endingSaga: IOrderEndingSagaAdapter, private readonly logger: ILoggerAdapter) { }

  async onModuleInit() {
    const topics = [TopicsEnum.NOTIFY_ENDING]
    this.logger.info({ message: "======initializer [order] consumer======", obj: { topics } })
    this.consumer.notifyEnding({
      eachMessage: async ({ message }) => {
        this.endingSaga.execute(message.value.toString())
      }
    })
  }
}
