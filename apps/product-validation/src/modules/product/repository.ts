import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { TypeORMRepository } from '@/infra/repository/postgres/repository';

import { ProductEntity } from '../../core/product/entity/product';
import { IProductRepository } from '../../core/product/repository/product';
import { ProductSchema } from '../../infra/database/schemas/product';

@Injectable()
export class ProductRepository
  extends TypeORMRepository<Model>
  implements IProductRepository
{
  constructor(readonly repository: Repository<Model>) {
    super(repository);
  }
}

type Model = ProductSchema & ProductEntity;
