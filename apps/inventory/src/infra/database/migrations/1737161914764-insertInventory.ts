import { MigrationInterface, QueryRunner } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { InventoryEntity } from '@/core/entity/inventory';

import { InventorySchema } from '../schemas/inventory';

export class InsertInventory1737161914764 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const product1 = new InventoryEntity({
      productCode: 'COMIC_BOOKS',
      available: 4,
    });
    const product2 = new InventoryEntity({
      productCode: 'BOOKS',
      available: 3,
    });
    const product3 = new InventoryEntity({
      productCode: 'MOVIES',
      available: 5,
    });
    const product4 = new InventoryEntity({
      productCode: 'MUSIC',
      available: 9,
    });
    await queryRunner.manager.insert(
      InventorySchema,
      product1 as QueryDeepPartialEntity<InventorySchema>,
    );
    await queryRunner.manager.insert(
      InventorySchema,
      product2 as QueryDeepPartialEntity<InventorySchema>,
    );
    await queryRunner.manager.insert(
      InventorySchema,
      product3 as QueryDeepPartialEntity<InventorySchema>,
    );
    await queryRunner.manager.insert(
      InventorySchema,
      product4 as QueryDeepPartialEntity<InventorySchema>,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`Delete from inventories`);
  }
}
