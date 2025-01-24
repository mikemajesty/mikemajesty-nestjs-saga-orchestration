import { Module } from '@nestjs/common';

import { IInventoryRepository } from '@/core/repository/inventory';
import { IOrderInventoryRepository } from '@/core/repository/order-inventory';
import { InventoryRollbackUsecase } from '@/core/use-cases/inventory-rollback';
import { InventoryUpdateUsecase } from '@/core/use-cases/inventory-update';
import { ILoggerAdapter, LoggerModule } from '@/infra/logger';

import { KafkaModule } from '../../infra/kafka/module';
import { IProducerAdapter } from '../../infra/producer/adapter';
import { ProducerModule } from '../../infra/producer/module';
import { InventoryModule } from '../inventory/module';
import { OrderInventoryModule } from '../order-inventory/module';
import { IInventoryRollbackAdapter, IInventoryUpdateAdapter } from './adapter';
import { ConsumerController } from './controller';

@Module({
  imports: [
    KafkaModule,
    InventoryModule,
    OrderInventoryModule,
    LoggerModule,
    ProducerModule,
  ],
  controllers: [ConsumerController],
  providers: [
    {
      provide: IInventoryRollbackAdapter,
      useFactory(
        producer: IProducerAdapter,
        inventoryRepository: IInventoryRepository,
        orderInventoryRepository: IOrderInventoryRepository,
        logger: ILoggerAdapter,
      ) {
        return new InventoryRollbackUsecase(
          producer,
          inventoryRepository,
          orderInventoryRepository,
          logger,
        );
      },
      inject: [
        IProducerAdapter,
        IInventoryRepository,
        IOrderInventoryRepository,
        ILoggerAdapter,
      ],
    },
    {
      provide: IInventoryUpdateAdapter,
      useFactory(
        inventoryRepository: IInventoryRepository,
        orderInventoryRepository: IOrderInventoryRepository,
        producer: IProducerAdapter,
        logger: ILoggerAdapter,
      ) {
        return new InventoryUpdateUsecase(
          inventoryRepository,
          orderInventoryRepository,
          producer,
          logger,
        );
      },
      inject: [
        IInventoryRepository,
        IOrderInventoryRepository,
        IProducerAdapter,
        ILoggerAdapter,
      ],
    },
  ],
  exports: [IInventoryRollbackAdapter, IInventoryUpdateAdapter],
})
export class ConsumerModule {}
