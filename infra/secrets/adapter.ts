export abstract class ISecretsAdapter {
  ENV: string;

  APPS: {
    ORDER: {
      PORT: number | string;
      HOST: string;
      DATABASE: {
        HOST: string
        PORT: number
        USER: string
        PASSWORD: string
        DATABASE: string
      }
    };
    ORCHESTRATOR: {
      PORT: number | string;
      HOST: string;
    };
    PAYMENT: {
      PORT: number | string;
      HOST: string;
      DATABASE: {
        HOST: string
        PORT: number
        USER: string
        PASSWORD: string
        DATABASE: string
        URI: string
      }
    };
    PRODUCT_VALIDATOR: {
      PORT: number | string;
      HOST: string;
      DATABASE: {
        HOST: string
        PORT: number
        USER: string
        PASSWORD: string
        DATABASE: string
        URI: string
      }
    },
    INVENTORY: {
      PORT: number | string;
      HOST: string;
      DATABASE: {
        HOST: string
        PORT: number
        USER: string
        PASSWORD: string
        DATABASE: string
        URI: string
      }
    }
  };

  MONGO: {
    MONGO_URL: string;
  };

  IS_LOCAL: boolean;

  IS_PRODUCTION!: boolean;
}
