import { IRepository } from '@/infra/repository';

import { ProductValidationEntity } from '../entity/validation';

export abstract class IProductValidationRepository extends IRepository<ProductValidationEntity> {
  abstract existsBy(filter: {
    [key in keyof Pick<
      ProductValidationEntity,
      'orderId' | 'transactionId'
    >]: string[];
  }): Promise<boolean>;
  abstract findBy(filter: {
    [key in keyof Pick<
      ProductValidationEntity,
      'orderId' | 'transactionId'
    >]: string[];
  }): Promise<ProductValidationEntity>;
}
