import { Injectable } from '@nestjs/common';
import { FindOneOptions, In, Repository } from 'typeorm';

import { TypeORMRepository } from '@/infra/repository/postgres/repository';

import { ProductValidationEntity } from '../../core/validation/entity/validation';
import { IProductValidationRepository } from '../../core/validation/repository/validation';
import { ProductValidationSchema } from '../../infra/database/schemas/product-validation';

@Injectable()
export class ProductValidationRepository
  extends TypeORMRepository<Model>
  implements IProductValidationRepository
{
  constructor(readonly repository: Repository<Model>) {
    super(repository);
  }

  async existsBy(filter: {
    [key in keyof Pick<
      ProductValidationEntity,
      'orderId' | 'transactionId'
    >]: string[];
  }): Promise<boolean> {
    const where: { [key: string]: unknown } = {
      deletedAt: null,
    };
    for (const key of Object.keys(filter)) {
      where[`${key}`] = In((filter as { [key: string]: any })[`${key}`]);
    }
    return this.repository.exists({
      where,
    } as FindOneOptions<ProductValidationEntity>);
  }

  async findBy(filter: {
    [key in keyof Pick<
      ProductValidationEntity,
      'orderId' | 'transactionId'
    >]: string[];
  }): Promise<ProductValidationEntity> {
    const where: { [key: string]: unknown } = {
      deletedAt: null,
    };
    for (const key of Object.keys(filter)) {
      where[`${key}`] = In((filter as { [key: string]: any })[`${key}`]);
    }
    const model = await this.repository.findOne({
      where,
    } as FindOneOptions<ProductValidationEntity>);

    return model;
  }
}

type Model = ProductValidationSchema & ProductValidationEntity;
