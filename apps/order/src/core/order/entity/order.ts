import {
  OrderEntity as Entity,
  OrderEntitySchema as Schema,
} from '@/entities/order';

export const OrderEntitySchema = Schema;

export class OrderEntity extends Entity {}
