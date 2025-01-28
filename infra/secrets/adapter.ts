export abstract class ISecretsAdapter {
  ENV: string;

  KAFKA_BROKEN: string;

  LOG_LEVEL: string

  DATE_FORMAT: string

  TZ: string

  APPS: {
    ORDER?: {
      PORT?: number | string;
      HOST?: string;
      DATABASE?: {
        HOST?: string;
        PORT?: number;
        USER?: string;
        PASSWORD?: string;
        DATABASE?: string;
        URI?: string;
      };
      KAFKA?: {
        GROUP?: string;
        CLIENT_ID?: string;
      };
    };
    ORCHESTRATOR?: {
      KAFKA?: {
        GROUP?: string;
        CLIENT_ID?: string;
      };
    };
    PAYMENT?: {
      DATABASE?: {
        HOST?: string;
        PORT?: number;
        USER?: string;
        PASSWORD?: string;
        DATABASE?: string;
        URI?: string;
      };
      KAFKA?: {
        GROUP?: string;
        CLIENT_ID?: string;
      };
    };
    PRODUCT_VALIDATOR?: {
      DATABASE?: {
        HOST?: string;
        PORT?: number;
        USER?: string;
        PASSWORD?: string;
        DATABASE?: string;
        URI?: string;
      };
      KAFKA?: {
        GROUP?: string;
        CLIENT_ID?: string;
      };
    };
    INVENTORY?: {
      DATABASE?: {
        HOST?: string;
        PORT?: number;
        USER?: string;
        PASSWORD?: string;
        DATABASE?: string;
        URI?: string;
      };
      KAFKA?: {
        GROUP?: string;
        CLIENT_ID?: string;
      };
    };
  };

  IS_LOCAL: boolean;

  IS_PRODUCTION!: boolean;

  OBSERVABILITY: {
    ZIPKIN_URL?: string
    PROMETHUES_URL?: string
    GRAFANA_URL?: string
  }
}
