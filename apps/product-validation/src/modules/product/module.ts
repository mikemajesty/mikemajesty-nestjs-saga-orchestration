import { Module } from '@nestjs/common';

import { KafkaModule } from '../../infra/kafka/module';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { ProductSchema } from '../../infra/database/schemas/product';
import { ProductValidationSchema } from '../../infra/database/schemas/product-validation';
import { IProductRepository } from '../../core/product/repository/product';
import { IProductValidationRepository } from '../../core/product/repository/product-validation';
import { ProductEntity } from '@/core/order/entity/product';
import { Repository } from 'typeorm';
import { ProductValidationEntity } from '../../core/product/entity/product-validation';
import { ProductRepository } from './repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductSchema])],
  providers: [{
    provide: IProductRepository,
    useFactory: (repository: Repository<ProductSchema & ProductEntity>) => {
      return new ProductRepository(repository);
    },
    inject: [getRepositoryToken(ProductSchema)]
  }
  ],
})
export class ProductModule { }
