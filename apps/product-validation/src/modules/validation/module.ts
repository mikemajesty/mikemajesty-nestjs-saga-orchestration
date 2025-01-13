import { Module } from '@nestjs/common';

import { KafkaModule } from '../../infra/kafka/module';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { ProductSchema } from '../../infra/database/schemas/product';
import { ProductValidationSchema } from '../../infra/database/schemas/product-validation';
import { IProductRepository } from '../../core/product/repository/product';
import { ProductEntity } from '@/core/order/entity/product';
import { Repository } from 'typeorm';
import { ProductValidationRepository } from './repository';
import { IProductValidationRepository } from '../../core/validation/repository/validation';
import { ProductValidationEntity } from '../../core/validation/entity/validation';

@Module({
  imports: [TypeOrmModule.forFeature([ProductValidationSchema])],
  providers: [
  {
    provide: IProductValidationRepository,
    useFactory: (repository: Repository<ProductValidationSchema & ProductValidationEntity>) => {
      return new ProductValidationRepository(repository);
    },
    inject: [getRepositoryToken(ProductValidationSchema)]
  }],
  exports: [IProductValidationRepository]
})
export class ProductValidationModule {}
