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

  PORT = this.config.get<number>('PORT') as number;

  HOST = this.config.get('HOST');

  LOG_LEVEL = this.config.get('LOG_LEVEL');

  DATE_FORMAT = this.config.get('DATE_FORMAT');

  TZ = this.config.get('TZ');

  REDIS_URL = this.config.get('REDIS_URL');

  APPS = {
    ORDER: {
      PORT: this.config.get<number>('ORDER_APP_PORT') as number,
      HOST: this.config.get<string>('ORDER_APP_HOST') as string
    },
    ORCHESTRATOR: {
      PORT: this.config.get<number>('ORCHESTRATOR_APP_PORT') as number,
      HOST: this.config.get<string>('ORCHESTRATOR_APP_HOST') as string
    },
    PAYMENT: {
      PORT: this.config.get<number>('PAYMENT_APP_PORT') as number,
      HOST: this.config.get<string>('PAYMENT_APP_HOST') as string
    },
    PRODUCT_VALIDATOR: {
      PORT: this.config.get<number>('PRODUCT_VALIDATOR_APP_PORT') as number,
      HOST: this.config.get<string>('PRODUCT_VALIDATOR_APP_HOST') as string
    },
    INVENTORY: {
      PORT: this.config.get<number>('INVENTORY_APP_PORT') as number,
      HOST: this.config.get<string>('INVENTORY_APP_HOST') as string
    }
  };

  MONGO = {
    MONGO_URL: this.config.get('MONGO_URL'),
  };

  POSTGRES = {
    POSTGRES_URL: `postgresql://${this.config.get('POSTGRES_USER')}:${this.config.get(
      'POSTGRES_PASSWORD'
    )}@${this.config.get('POSTGRES_HOST')}:${this.config.get('POSTGRES_PORT')}/${this.config.get('POSTGRES_DATABASE')}`,
    POSTGRES_PGADMIN_URL: this.config.get('PGADMIN_URL')
  };

}
