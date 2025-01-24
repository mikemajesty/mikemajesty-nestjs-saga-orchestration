import { z } from 'zod';

import { BaseEntity } from '@/utils/entity';

const Code = z.string();
const UnitValue = z.number();

export const ProductEntitySchema = z.object({
  code: Code,
  unitValue: UnitValue,
});

type Product = z.infer<typeof ProductEntitySchema>;

export class ProductEntity extends BaseEntity<ProductEntity>() {
  code!: string;

  unitValue!: number;

  constructor(entity: Product) {
    super(ProductEntitySchema);
    Object.assign(this, this.validate(entity));
  }
}
