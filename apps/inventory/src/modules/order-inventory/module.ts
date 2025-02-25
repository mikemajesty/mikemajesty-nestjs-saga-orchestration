import { Module } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OrderInventoryEntity } from '@/core/entity/order-inventory';
import { IOrderInventoryRepository } from '@/core/repository/order-inventory';

import { OrderInventorySchema } from '../../infra/database/schemas/order-inventory';
import { OrderInventoryRepository } from './repository';

@Module({
  imports: [TypeOrmModule.forFeature([OrderInventorySchema])],
  providers: [
    {
      provide: IOrderInventoryRepository,
      useFactory(
        repository: Repository<OrderInventorySchema & OrderInventoryEntity>,
      ) {
        return new OrderInventoryRepository(repository);
      },
      inject: [getRepositoryToken(OrderInventorySchema)],
    },
  ],
  exports: [IOrderInventoryRepository],
})
export class OrderInventoryModule {}
