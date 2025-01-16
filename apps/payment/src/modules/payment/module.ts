import { Module } from '@nestjs/common';

import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentSchema } from '../../infra/database/schemas/payment';
import { PaymentRepository } from './repository';
import { PaymentEntity } from '@/core/entity/payment';
import { IPaymentRepository } from '@/core/repository/payment';
import { IPaymentRealizeAdapter, IPaymentRefundAdapter } from './adapter';
import { PaymentRealizeUsecase } from '@/core/use-cases/payment-realize';
import { IProducerAdapter } from '../../infra/producer/adapter';
import { ILoggerAdapter, LoggerModule } from '@/infra/logger';
import { PaymentRefundUsecase } from '@/core/use-cases/payment-refund';
import { ProducerModule } from '../../infra/producer/module';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentSchema]), PaymentModule, LoggerModule, ProducerModule],
  providers: [{
    provide: IPaymentRepository,
    useFactory: (repository: Repository<PaymentSchema & PaymentEntity>) => {
      return new PaymentRepository(repository);
    },
    inject: [getRepositoryToken(PaymentSchema)]
  },
  {
    provide: IPaymentRealizeAdapter,
    useFactory(producer: IProducerAdapter,
      repository: IPaymentRepository,
      logger: ILoggerAdapter) {
      return new PaymentRealizeUsecase(producer, repository, logger)
    },
    inject: [IProducerAdapter, IPaymentRepository, ILoggerAdapter]
  },
  {
    provide: IPaymentRefundAdapter,
    useFactory(producer: IProducerAdapter,
      repository: IPaymentRepository,
      logger: ILoggerAdapter) {
      return new PaymentRefundUsecase(producer, repository, logger)
    },
    inject: [IProducerAdapter, IPaymentRepository, ILoggerAdapter]
  }
  ],
  exports: [IPaymentRepository, IPaymentRefundAdapter, IPaymentRealizeAdapter]
})
export class PaymentModule { }
