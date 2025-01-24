export abstract class ISecretsAdapter {
  ENV: string;

  KAFKA_BROKEN: string;

  APPS: {
    ORDER: {
      PORT: number | string;
      HOST: string;
      DATABASE: {
        HOST: string;
        PORT: number;
        USER: string;
        PASSWORD: string;
        DATABASE: string;
        URI: string;
      };
      KAFKA: {
        GROUP: string;
        CLIENT_ID: string;
      };
    };
    ORCHESTRATOR: {
      PORT: number | string;
      HOST: string;
      KAFKA: {
        GROUP: string;
        CLIENT_ID: string;
      };
    };
    PAYMENT: {
      PORT: number | string;
      HOST: string;
      DATABASE: {
        HOST: string;
        PORT: number;
        USER: string;
        PASSWORD: string;
        DATABASE: string;
        URI: string;
      };
      KAFKA: {
        GROUP: string;
        CLIENT_ID: string;
      };
    };
    PRODUCT_VALIDATOR: {
      PORT: number | string;
      HOST: string;
      DATABASE: {
        HOST: string;
        PORT: number;
        USER: string;
        PASSWORD: string;
        DATABASE: string;
        URI: string;
      };
      KAFKA: {
        GROUP: string;
        CLIENT_ID: string;
      };
    };
    INVENTORY: {
      PORT: number | string;
      HOST: string;
      DATABASE: {
        HOST: string;
        PORT: number;
        USER: string;
        PASSWORD: string;
        DATABASE: string;
        URI: string;
      };
      KAFKA: {
        GROUP: string;
        CLIENT_ID: string;
      };
    };
  };

  IS_LOCAL: boolean;

  IS_PRODUCTION!: boolean;
}
