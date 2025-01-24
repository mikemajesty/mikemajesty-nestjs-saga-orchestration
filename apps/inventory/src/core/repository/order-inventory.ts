import { IRepository } from '@/infra/repository/adapter';

import { OrderInventoryEntity } from '../entity/order-inventory';

export abstract class IOrderInventoryRepository extends IRepository<OrderInventoryEntity> {}
