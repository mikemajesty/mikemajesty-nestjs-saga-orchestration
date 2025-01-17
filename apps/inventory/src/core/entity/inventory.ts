import { BaseEntity } from "@/utils/entity";
import { z } from "zod";

const CreatedAt = z.date().or(z.string()).nullish().optional();
const UpdatedAt = z.date().or(z.string()).nullish().optional();
const DeletedAt = z.date().or(z.string()).nullish().optional();

export const InventoryEntitySchema = z.object({
  id: z.string().uuid(),
  productCode: z.string(),
  available: z.number(),
  createdAt: CreatedAt,
  updatedAt: UpdatedAt,
  deletedAt: DeletedAt
});

type Product = z.infer<typeof InventoryEntitySchema>;

export class InventoryEntity extends BaseEntity<InventoryEntity>() {
  id!: string

  productCode!: string

  available!: number
  
  constructor(entity: Product) {
    super(InventoryEntitySchema);
    Object.assign(this, this.validate(entity));
  }
}