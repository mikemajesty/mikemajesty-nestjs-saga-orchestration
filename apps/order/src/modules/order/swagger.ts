import { Swagger } from '@/utils/swagger';

import {
  OrderProducerCreateInput,
  OrderProducerCreateOutput,
} from '../../core/order/use-cases/order-producer-create';

export const SwaggerResponse = {
  create: {
    200: Swagger.defaultResponseJSON<OrderProducerCreateOutput>({
      status: 200,
      description: 'create order.',
    }),
  },
};

export const SwaggerRequest = {
  create: Swagger.defaultRequestJSON<OrderProducerCreateInput>({
    products: [
      {
        product: {
          code: 'COMIC_BOOKS',
          unitValue: 15.5,
        },
        quantity: 3,
      },
      {
        product: {
          code: 'BOOKS',
          unitValue: 9.9,
        },
        quantity: 1,
      },
    ],
  }),
};
