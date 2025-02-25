import { IRepository } from '@/infra/repository';

import { ProductEntity } from '../entity/product';

export abstract class IProductRepository extends IRepository<ProductEntity> {}
