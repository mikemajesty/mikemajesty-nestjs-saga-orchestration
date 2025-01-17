import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { TypeORMRepository } from '@/infra/repository/postgres/repository';
import { IOrderInventoryRepository } from '@/core/repository/order-inventory';
import { OrderInventorySchema } from '../../infra/database/schemas/order-inventory';
import { OrderInventoryEntity } from '@/core/entity/order-inventory';
import { IInventoryRepository } from '@/core/repository/inventory';
import { InventoryEntity } from '@/core/entity/inventory';
import { InventorySchema } from '../../infra/database/schemas/inventory';

@Injectable()
export class InventoryRepository extends TypeORMRepository<Model> implements IInventoryRepository {
  constructor(readonly repository: Repository<Model>) {
    super(repository);
  }
}

type Model = InventorySchema & InventoryEntity;