export abstract class ISecretsAdapter {
  ENV: string;

  APPS: {
    ORDER: {
      PORT: number | string;
      HOST: string;
    };
    ORCHESTRATOR: {
      PORT: number | string;
      HOST: string;
    };
    PAYMENT: {
      PORT: number | string;
      HOST: string;
    };
    PRODUCT_VALIDATOR: {
      PORT: number | string;
      HOST: string;
    },
    INVENTORY: {
      PORT: number | string;
      HOST: string;
    }
  };

  MONGO: {
    MONGO_URL: string;
  };

  POSTGRES: {
    POSTGRES_URL: string;
  };

  IS_LOCAL: boolean;

  IS_PRODUCTION!: boolean;
}
