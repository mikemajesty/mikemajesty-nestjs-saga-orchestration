import { Injectable } from '@nestjs/common';
import { FindOptionsOrder, FindOptionsRelations, FindOptionsWhere, Not, Repository } from 'typeorm';

import { TypeORMRepository } from '@/infra/repository/postgres/repository';
import { ProductValidationSchema } from '../../infra/database/schemas/product-validation';
import { IProductValidationRepository } from '../../core/product/repository/product-validation';
import { ProductValidationEntity } from '../../core/product/entity/product-validation';
import { IProductRepository } from '../../core/product/repository/product';
import { ProductSchema } from '../../infra/database/schemas/product';
import { ProductEntity } from '../../core/product/entity/product';

@Injectable()
export class ProductRepository extends TypeORMRepository<Model> implements IProductRepository {
  constructor(readonly repository: Repository<Model>) {
    super(repository);
  }
}

type Model = ProductSchema & ProductEntity;