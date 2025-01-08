import { OrderCreateInput, OrderCreateOutput } from '../../core/order/use-cases/order-create';
import { Swagger } from '@/utils/swagger';

export const SwaggerResponse = {
  create: {
    200: Swagger.defaultResponseJSON<OrderCreateOutput>({
      status: 200,
      description: 'create order.'
    })
  }
};

export const SwaggerRequest = {
  create: Swagger.defaultRequestJSON<OrderCreateInput>({
    "products": [
      {
        "product": {
          "code": "COMIC_BOOKS",
          "unitValue": 15.50
        },
        "quantity": 3
      },
      {
        "product": {
          "code": "BOOKS",
          "unitValue": 9.90
        },
        "quantity": 1
      }
    ]
  }),
};