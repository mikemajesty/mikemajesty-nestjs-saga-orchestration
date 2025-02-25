import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { OrderInventoryEntity } from '@/core/entity/order-inventory';
import { IOrderInventoryRepository } from '@/core/repository/order-inventory';
import { TypeORMRepository } from '@/infra/repository/postgres/repository';

import { OrderInventorySchema } from '../../infra/database/schemas/order-inventory';

@Injectable()
export class OrderInventoryRepository
  extends TypeORMRepository<Model>
  implements IOrderInventoryRepository
{
  constructor(readonly repository: Repository<Model>) {
    super(repository);
  }
}

type Model = OrderInventorySchema & OrderInventoryEntity;
