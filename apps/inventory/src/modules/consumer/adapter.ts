import {
  InventoryRollbackInput,
  InventoryRollbackOutput,
} from '@/core/use-cases/inventory-rollback';
import {
  InventoryUpdateInput,
  InventoryUpdateOutput,
} from '@/core/use-cases/inventory-update';
import { IUsecase } from '@/utils/usecase';

export abstract class IInventoryRollbackAdapter implements IUsecase {
  abstract execute(
    input: InventoryRollbackInput,
  ): Promise<InventoryRollbackOutput>;
}

export abstract class IInventoryUpdateAdapter implements IUsecase {
  abstract execute(input: InventoryUpdateInput): Promise<InventoryUpdateOutput>;
}
