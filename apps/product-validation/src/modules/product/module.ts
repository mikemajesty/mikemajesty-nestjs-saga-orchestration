import { Module } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductEntity } from '@/core/order/entity/product';

import { IProductRepository } from '../../core/product/repository/product';
import { ProductSchema } from '../../infra/database/schemas/product';
import { ProductRepository } from './repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductSchema])],
  providers: [
    {
      provide: IProductRepository,
      useFactory: (repository: Repository<ProductSchema & ProductEntity>) => {
        return new ProductRepository(repository);
      },
      inject: [getRepositoryToken(ProductSchema)],
    },
  ],
  exports: [IProductRepository],
})
export class ProductModule {}
