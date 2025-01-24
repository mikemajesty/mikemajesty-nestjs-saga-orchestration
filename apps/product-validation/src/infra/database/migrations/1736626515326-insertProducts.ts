import { MigrationInterface, QueryRunner } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { ProductEntity } from '@/core/order/entity/product';

import { ProductSchema } from '../schemas/product';

export class InsertProducts1736626515326 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const product1 = new ProductEntity({
      code: 'COMIC_BOOKS',
      unitValue: 4,
    });
    const product2 = new ProductEntity({
      code: 'BOOKS',
      unitValue: 4,
    });
    const product3 = new ProductEntity({
      code: 'MOVIES',
      unitValue: 4,
    });
    const product4 = new ProductEntity({
      code: 'MUSIC',
      unitValue: 4,
    });
    await queryRunner.manager.insert(
      ProductSchema,
      product1 as QueryDeepPartialEntity<ProductSchema>,
    );
    await queryRunner.manager.insert(
      ProductSchema,
      product2 as QueryDeepPartialEntity<ProductSchema>,
    );
    await queryRunner.manager.insert(
      ProductSchema,
      product3 as QueryDeepPartialEntity<ProductSchema>,
    );
    await queryRunner.manager.insert(
      ProductSchema,
      product4 as QueryDeepPartialEntity<ProductSchema>,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`Delete from products`);
  }
}
