import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { InventoryEntity } from '@/core/entity/inventory';
import { IInventoryRepository } from '@/core/repository/inventory';
import { TypeORMRepository } from '@/infra/repository/postgres/repository';

import { InventorySchema } from '../../infra/database/schemas/inventory';

@Injectable()
export class InventoryRepository
  extends TypeORMRepository<Model>
  implements IInventoryRepository
{
  constructor(readonly repository: Repository<Model>) {
    super(repository);
  }
}

type Model = InventorySchema & InventoryEntity;
