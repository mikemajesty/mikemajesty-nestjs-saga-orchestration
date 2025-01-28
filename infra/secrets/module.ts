import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { z, ZodError, ZodIssue } from 'zod';

import { ApiInternalServerException } from '@/utils/exception';
import { ZodInferSchema } from '@/utils/types';

import { LogLevelEnum } from '../logger';
import { ISecretsAdapter } from './adapter';
import { SecretsService } from './service';
import { EnvEnum } from './types';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env']
    })
  ],
  providers: [
    {
      provide: ISecretsAdapter,
      useFactory: (config: ConfigService) => {
        const SecretsSchema = z.object<ZodInferSchema<ISecretsAdapter>>({
          ENV: z.nativeEnum(EnvEnum),
          IS_LOCAL: z.boolean(),
          IS_PRODUCTION: z.boolean(),
          LOG_LEVEL: z.nativeEnum(LogLevelEnum),
          DATE_FORMAT: z.string(),
          TZ: z.string(),
          OBSERVABILITY: z.object({
            PROMETHUES_URL: z.string().url(),
            GRAFANA_URL: z.string().url(),
            ZIPKIN_URL: z.string().url(),
          }),
          KAFKA_BROKEN: z.string(),
          APPS: z.object({
            ORDER: z.object({
              PORT: z.number().or(z.string()).transform(v => Number(v)),
              HOST: z.string(),
              DATABASE: z.object({
                HOST: z.string(),
                PORT: z.number().or(z.string()).transform(v => Number(v)),
                USER: z.string(),
                PASSWORD: z.string(),
                DATABASE: z.string(),
                URI: z.string(),
              }),
              KAFKA: z.object({
                GROUP: z.string(),
                CLIENT_ID: z.string(),
              }),
            }),
            ORCHESTRATOR: z.object({
              KAFKA: z.object({
                GROUP: z.string(),
                CLIENT_ID: z.string(),
              }),
            }),
            PAYMENT: z.object({
              DATABASE: z.object({
                HOST: z.string(),
                PORT: z.number().or(z.string()).transform(v => Number(v)),
                USER: z.string(),
                PASSWORD: z.string(),
                DATABASE: z.string(),
                URI: z.string()
              }),
              KAFKA: z.object({
                GROUP: z.string(),
                CLIENT_ID: z.string(),
              }),
            }),
            PRODUCT_VALIDATOR: z.object({
              DATABASE: z.object({
                HOST: z.string(),
                PORT: z.number().or(z.string()).transform(v => Number(v)),
                USER: z.string(),
                PASSWORD: z.string(),
                DATABASE: z.string(),
                URI: z.string()
              }),
              KAFKA: z.object({
                GROUP: z.string(),
                CLIENT_ID: z.string(),
              }),
            }),
            INVENTORY: z.object({
              DATABASE: z.object({
                HOST: z.string(),
                PORT: z.number().or(z.string()).transform(v => Number(v)),
                USER: z.string(),
                PASSWORD: z.string(),
                DATABASE: z.string(),
                URI: z.string()
              }),
              KAFKA: z.object({
                GROUP: z.string(),
                CLIENT_ID: z.string()
              })
            })
          })
        });
        const secret = new SecretsService(config);

        try {
          SecretsSchema.parse(secret);
        } catch (error) {
          const zodError = error as ZodError;
          const message = zodError.issues
            .map((i: ZodIssue) => `${SecretsService.name}.${i.path.join('.')}: ${i.message}`)
            .join(',');
          throw new ApiInternalServerException(message);
        }

        return SecretsSchema.parse(secret);
      },
      inject: [ConfigService]
    }
  ],
  exports: [ISecretsAdapter]
})
export class SecretsModule {}