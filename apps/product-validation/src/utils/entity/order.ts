import { OrderProduct } from './order-product';

export class Order {
  id: string

  products: OrderProduct[]

  transactionId: string

  totalItems: number

  totalAmount: number

  constructor(entity: object) {
    Object.assign(this, entity);
  }
}