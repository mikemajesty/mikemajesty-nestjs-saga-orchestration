import { IRepository } from '@/infra/repository';

import { PaymentEntity } from '../entity/payment';

export abstract class IPaymentRepository extends IRepository<PaymentEntity> {}
