export class Product {
  code!: string;

  unitValue!: number;

  constructor(entity: object) {
    Object.assign(this, entity);
  }
}