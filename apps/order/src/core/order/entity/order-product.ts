import {
  OrderProductEntity as Entity,
  OrderProductEntitySchema as Schema,
} from '@/entities/order-product';

export const OrderProductEntitySchema = Schema;

export class OrderProductEntity extends Entity {}
