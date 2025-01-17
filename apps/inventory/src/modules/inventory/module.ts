import { Module } from '@nestjs/common';
import { InventorySchema } from '../../infra/database/schemas/inventory';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { IInventoryRepository } from '@/core/repository/inventory';
import { InventoryRepository } from './repository';
import { InventoryEntity } from '@/core/entity/inventory';
import { Repository } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([InventorySchema])],
  providers: [
    {
      provide: IInventoryRepository,
      useFactory(repository: Repository<InventorySchema & InventoryEntity>) {
        return new InventoryRepository(repository)
      },
      inject: [getRepositoryToken(InventorySchema)]
    },
  ],
  exports: [IInventoryRepository]
})
export class InventoryModule { }