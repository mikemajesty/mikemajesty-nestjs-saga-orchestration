import {
  ProductEntity as Entity,
  ProductEntitySchema as Schema,
} from '@/entities/product';

export const ProductEntitySchema = Schema;

export class ProductEntity extends Entity {}
