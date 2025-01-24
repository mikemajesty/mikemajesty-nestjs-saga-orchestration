import { Module } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { InventoryEntity } from '@/core/entity/inventory';
import { IInventoryRepository } from '@/core/repository/inventory';

import { InventorySchema } from '../../infra/database/schemas/inventory';
import { InventoryRepository } from './repository';

@Module({
  imports: [TypeOrmModule.forFeature([InventorySchema])],
  providers: [
    {
      provide: IInventoryRepository,
      useFactory(repository: Repository<InventorySchema & InventoryEntity>) {
        return new InventoryRepository(repository);
      },
      inject: [getRepositoryToken(InventorySchema)],
    },
  ],
  exports: [IInventoryRepository],
})
export class InventoryModule {}
