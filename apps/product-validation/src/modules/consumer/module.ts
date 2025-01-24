import { Module } from '@nestjs/common';
import { IProducerAdapter } from 'apps/product-validation/src/infra/producer/adapter';

import { IProductRepository } from '@/core/product/repository/product';
import { IProductValidationRepository } from '@/core/validation/repository/validation';
import { ValidateRollbackUsecase } from '@/core/validation/use-cases/validation-rollback';
import { ValidationSuccessUsecase } from '@/core/validation/use-cases/validation-success';
import { ILoggerAdapter, LoggerModule } from '@/infra/logger';

import { KafkaModule } from '../../infra/kafka/module';
import { ProducerModule } from '../../infra/producer/module';
import { ProductModule } from '../product/module';
import { ProductValidationModule } from '../validation/module';
import { IValidateRollbackAdapter, IValidationSuccessAdapter } from './adapter';
import { ConsumerController } from './controller';

@Module({
  imports: [
    KafkaModule,
    ProducerModule,
    LoggerModule,
    ProductValidationModule,
    ProductModule,
    ProductValidationModule,
  ],
  controllers: [ConsumerController],
  providers: [
    {
      provide: IValidationSuccessAdapter,
      useFactory(
        producer: IProducerAdapter,
        productRepository: IProductRepository,
        productValidationRepository: IProductValidationRepository,
        logger: ILoggerAdapter,
      ) {
        return new ValidationSuccessUsecase(
          producer,
          productRepository,
          productValidationRepository,
          logger,
        );
      },
      inject: [
        IProducerAdapter,
        IProductRepository,
        IProductValidationRepository,
        ILoggerAdapter,
      ],
    },
    {
      provide: IValidateRollbackAdapter,
      useFactory(
        producer: IProducerAdapter,
        productValidationRepository: IProductValidationRepository,
        logger: ILoggerAdapter,
      ) {
        return new ValidateRollbackUsecase(
          producer,
          productValidationRepository,
          logger,
        );
      },
      inject: [IProducerAdapter, IProductValidationRepository, ILoggerAdapter],
    },
  ],
})
export class ConsumerModule {}
