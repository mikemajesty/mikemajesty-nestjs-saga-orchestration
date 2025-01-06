import { GROUPS } from './../../node_modules/ip-address/src/v4/constants';
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
        URI: string
      }
      KAFKA: {
        NAME: string
        GROUP: string
        CLIENT_ID: string
      }
    };
    ORCHESTRATOR: {
      PORT: number | string;
      HOST: string;
      KAFKA: {
        NAME: string
        GROUP: string
        CLIENT_ID: string
      }
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
      KAFKA: {
        NAME: string
        GROUP: string
        CLIENT_ID: string
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
      KAFKA: {
        NAME: string
        GROUP: string
        CLIENT_ID: string
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
      KAFKA: {
        NAME: string
        GROUP: string
        CLIENT_ID: string
      }
    }
  };

  IS_LOCAL: boolean;

  IS_PRODUCTION!: boolean;
}
