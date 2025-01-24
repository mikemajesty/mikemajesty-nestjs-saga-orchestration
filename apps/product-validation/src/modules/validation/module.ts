import { Module } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductValidationEntity } from '../../core/validation/entity/validation';
import { IProductValidationRepository } from '../../core/validation/repository/validation';
import { ProductValidationSchema } from '../../infra/database/schemas/product-validation';
import { ProductValidationRepository } from './repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductValidationSchema])],
  providers: [
    {
      provide: IProductValidationRepository,
      useFactory: (
        repository: Repository<
          ProductValidationSchema & ProductValidationEntity
        >,
      ) => {
        return new ProductValidationRepository(repository);
      },
      inject: [getRepositoryToken(ProductValidationSchema)],
    },
  ],
  exports: [IProductValidationRepository],
})
export class ProductValidationModule {}
