import { Module } from '@nestjs/common';

import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentSchema } from '../../infra/database/schemas/payment';
import { PaymentRepository } from './repository';
import { PaymentEntity } from '@/core/entity/payment';
import { IPaymentRepository } from '@/core/repository/payment';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentSchema])],
  providers: [{
    provide: IPaymentRepository,
    useFactory: (repository: Repository<PaymentSchema & PaymentEntity>) => {
      return new PaymentRepository(repository);
    },
    inject: [getRepositoryToken(PaymentSchema)]
  }
  ],
  exports: [IPaymentRepository]
})
export class PaymentModule { }
