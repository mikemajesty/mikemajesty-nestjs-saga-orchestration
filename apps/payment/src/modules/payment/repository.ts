import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { IPaymentRepository } from '@/core/repository/payment';
import { PaymentSchema } from '../../infra/database/schemas/payment';
import { PaymentEntity } from '@/core/entity/payment';
import { TypeORMRepository } from '@/infra/repository/postgres/repository';

@Injectable()
export class PaymentRepository extends TypeORMRepository<Model> implements IPaymentRepository {
  constructor(readonly repository: Repository<Model>) {
    super(repository);
  }
}

type Model = PaymentSchema & PaymentEntity;