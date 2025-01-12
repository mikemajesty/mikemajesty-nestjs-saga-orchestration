import { z } from 'zod';

import { ProductEntity as Entity, ProductEntitySchema as Schema } from '@/entities/product';

export const ProductEntitySchema = Schema

type Product = z.infer<typeof ProductEntitySchema>;

export class ProductEntity extends Entity {}