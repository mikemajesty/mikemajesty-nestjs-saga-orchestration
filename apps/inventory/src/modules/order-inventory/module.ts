import { Module } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { OrderInventorySchema } from '../../infra/database/schemas/order-inventory';
import { IOrderInventoryRepository } from '@/core/repository/order-inventory';
import { OrderInventoryRepository } from './repository';
import { OrderInventoryEntity } from '@/core/entity/order-inventory';
import { Repository } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([OrderInventorySchema])],
  providers: [
    {
      provide: IOrderInventoryRepository,
      useFactory(repository: Repository<OrderInventorySchema & OrderInventoryEntity>) {
          return new OrderInventoryRepository(repository)
      },
      inject: [getRepositoryToken(OrderInventorySchema)]
    },
    
  ],
  exports: [IOrderInventoryRepository]
})
export class OrderInventoryModule {}