import { InventoryEntity } from "../entity/inventory";
import { IRepository } from '@/infra/repository/adapter';

export abstract class IInventoryRepository extends IRepository<InventoryEntity> {}