import { BaseEntity } from "@/utils/entity";
import { z } from "zod";
import { InventoryEntity, InventoryEntitySchema } from "./inventory";

const CreatedAt = z.date().or(z.string()).nullish().optional();
const UpdatedAt = z.date().or(z.string()).nullish().optional();
const DeletedAt = z.date().or(z.string()).nullish().optional();

export const OrderInventoryEntitySchema = z.object({
  id: z.string().uuid(),
  transactionId: z.string(),
  orderQuantity: z.number(),
  inventory: InventoryEntitySchema,
  oldQuantity: z.number(),
  newQuantity: z.number(),
  createdAt: CreatedAt,
  updatedAt: UpdatedAt,
  deletedAt: DeletedAt
});

type Product = z.infer<typeof OrderInventoryEntitySchema>;

export class OrderInventoryEntity extends BaseEntity<OrderInventoryEntity>() {
  id!: string

  Id!: string

  transactionId!: string

  orderQuantity!: number
  
  oldQuantity!: number
  
  newQuantity!: number

  inventory: InventoryEntity
  
  constructor(entity: Product) {
    super(OrderInventoryEntitySchema);
    Object.assign(this, this.validate(entity));
  }
}