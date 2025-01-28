import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ISecretsAdapter } from './adapter';
import { EnvEnum } from './types';

@Injectable()
export class SecretsService implements ISecretsAdapter {
  constructor(private readonly config: ConfigService) {}

  IS_LOCAL = this.config.get<EnvEnum>('NODE_ENV') === EnvEnum.LOCAL;

  IS_PRODUCTION = this.config.get<EnvEnum>('NODE_ENV') === EnvEnum.PRD;

  ENV = this.config.get<EnvEnum>('NODE_ENV') as string;

  KAFKA_BROKEN = this.config.get<EnvEnum>('KAFKA_BROKEN') as string;

  PORT = this.config.get<number>('PORT') as number;

  HOST = this.config.get('HOST');

  LOG_LEVEL = this.config.get('LOG_LEVEL');

  DATE_FORMAT = this.config.get('DATE_FORMAT');

  TZ = this.config.get('TZ');

  REDIS_URL = this.config.get('REDIS_URL');

  OBSERVABILITY = {
    ZIPKIN_URL: this.config.get<string>('ZIPKIN_URL'),
    PROMETHUES_URL: this.config.get<string>('PROMETHUES_URL'),
    GRAFANA_URL: this.config.get<string>('GRAFANA_URL')
  }

  APPS = {
    ORDER: {
      PORT: this.config.get<number>('ORDER_APP_PORT') as number,
      HOST: this.config.get<string>('ORDER_APP_HOST') as string,
      DATABASE: {
        HOST: this.config.get<string>('ORDER_MONGO_HOST') as string,
        PORT: this.config.get<number>('ORDER_MONGO_PORT') as number,
        USER: this.config.get<string>('ORDER_MONGO_USER') as string,
        PASSWORD: this.config.get<string>('ORDER_MONGO_PASSWORD') as string,
        DATABASE: this.config.get<string>('ORDER_MONGO_DATABASE') as string,
        URI: this.config.get('MONGO_URL'),
      },
      KAFKA: {
        GROUP: this.config.get<string>('ORDER_SERVICE_GROUP_ID') as string,
        CLIENT_ID: this.config.get<string>('ORDER_SERVICE_CLIENT_ID') as string,
      },
    },
    ORCHESTRATOR: {
      KAFKA: {
        GROUP: this.config.get<string>(
          'ORCHESTRATOR_SERVICE_GROUP_ID',
        ) as string,
        CLIENT_ID: this.config.get<string>(
          'ORCHESTRATOR_SERVICE_CLIENT_ID',
        ) as string,
      },
    },
    PAYMENT: {
      DATABASE: {
        HOST: this.config.get<string>('PAYMENT_POSTGRES_HOST') as string,
        PORT: this.config.get<number>('PAYMENT_POSTGRES_PORT') as number,
        USER: this.config.get<string>('PAYMENT_POSTGRES_USER') as string,
        PASSWORD: this.config.get<string>(
          'PAYMENT_POSTGRES_PASSWORD',
        ) as string,
        DATABASE: this.config.get<string>(
          'PAYMENT_POSTGRES_DATABASE',
        ) as string,
        URI: `postgresql://${this.config.get('PAYMENT_POSTGRES_USER')}:${this.config.get(
          'PAYMENT_POSTGRES_PASSWORD',
        )}@${this.config.get('PAYMENT_POSTGRES_HOST')}:${this.config.get('PAYMENT_POSTGRES_PORT')}/${this.config.get('PAYMENT_POSTGRES_DATABASE')}`,
      },
      KAFKA: {
        GROUP: this.config.get<string>('PAYMENT_SERVICE_GROUP_ID') as string,
        CLIENT_ID: this.config.get<string>(
          'PAYMENT_SERVICE_CLIENT_ID',
        ) as string,
      },
    },
    PRODUCT_VALIDATOR: {
      DATABASE: {
        HOST: this.config.get<string>('PRODUCT_POSTGRES_HOST') as string,
        PORT: this.config.get<number>('PRODUCT_POSTGRES_PORT') as number,
        USER: this.config.get<string>('PRODUCT_POSTGRES_USER') as string,
        PASSWORD: this.config.get<string>(
          'PRODUCT_POSTGRES_PASSWORD',
        ) as string,
        DATABASE: this.config.get<string>(
          'PRODUCT_POSTGRES_DATABASE',
        ) as string,
        URI: `postgresql://${this.config.get('PAYMENT_POSTGRES_USER')}:${this.config.get(
          'PRODUCT_POSTGRES_PASSWORD',
        )}@${this.config.get('PRODUCT_POSTGRES_HOST')}:${this.config.get('PRODUCT_POSTGRES_PORT')}/${this.config.get('PRODUCT_POSTGRES_DATABASE')}`,
      },
      KAFKA: {
        GROUP: this.config.get<string>(
          'PRODUCT_VALIDATOR_SERVICE_GROUP_ID',
        ) as string,
        CLIENT_ID: this.config.get<string>(
          'PAYMENT_SERVICE_CLIENT_ID',
        ) as string,
      },
    },
    INVENTORY: {
      DATABASE: {
        HOST: this.config.get<string>('INVENTORY_POSTGRES_HOST') as string,
        PORT: this.config.get<number>('INVENTORY_POSTGRES_PORT') as number,
        USER: this.config.get<string>('INVENTORY_POSTGRES_USER') as string,
        PASSWORD: this.config.get<string>(
          'INVENTORY_POSTGRES_PASSWORD',
        ) as string,
        DATABASE: this.config.get<string>(
          'INVENTORY_POSTGRES_DATABASE',
        ) as string,
        URI: `postgresql://${this.config.get('PAYMENT_POSTGRES_USER')}:${this.config.get(
          'INVENTORY_POSTGRES_PASSWORD',
        )}@${this.config.get('INVENTORY_POSTGRES_HOST')}:${this.config.get('INVENTORY_POSTGRES_PORT')}/${this.config.get('INVENTORY_POSTGRES_DATABASE')}`,
      },
      KAFKA: {
        GROUP: this.config.get<string>('INVENTORY_SERVICE_GROUP_ID') as string,
        CLIENT_ID: this.config.get<string>(
          'INVENTORY_SERVICE_CLIENT_ID',
        ) as string,
      },
    },
  };
}
