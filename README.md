## Arquitetura Saga Orquestrado

### Project setup

```bash
$ npm install
```

### Compile and run the project

```bash
$ yarn infra
```

#### Payload

```
{
  "id": "64429e9a7a8b646915b37360",
  "transactionId": "1682087576536_99d2ca6c-f074-41a6-92e0-21700148b519",
  "orderId": "64429e987a8b646915b3735f",
  "payload": {
    "id": "64429e987a8b646915b3735f",
    "products": [
      {
        "product": {
          "code": "MOVIES",
          "unitValue": 9.9
        },
        "quantity": 5
      },
      {
        "product": {
          "code": "MUSIC",
          "unitValue": 9.9
        },
        "quantity": 9
      },
      {
        "product": {
          "code": "COMIC_BOOKS",
          "unitValue": 15.5
        },
        "quantity": 4
      },
      {
        "product": {
          "code": "BOOKS",
          "unitValue": 9.9
        },
        "quantity": 3
      }
    ],
    "transactionId": "1682087576536_99d2ca6c-f074-41a6-92e0-21700148b519"
  },
  "eventHistory": []
}
```

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
