import { Product } from "./product";

export class OrderProduct {
  product!: Product;

  quantity!: number;

  constructor(entity: object) {
    Object.assign(this, entity);
  }
}