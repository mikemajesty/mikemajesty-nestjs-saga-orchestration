import {
  Injectable,
  InternalServerErrorException,
  Scope,
} from '@nestjs/common';
import { blue, gray, green } from 'colorette';
import { LogDescriptor, Logger, pino } from 'pino';
import pinoPretty, { PrettyOptions } from 'pino-pretty';

import { DateUtils } from '@/utils/date';
import { ApiBadRequestException, BaseException } from '@/utils/exception';
import { UUIDUtils } from '@/utils/uuid';

import { ILoggerAdapter } from './adapter';
import { ErrorType, MessageType } from './types';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService implements ILoggerAdapter {
  private app!: string;

  logger!: Logger;

  async connect(): Promise<void> {
    const pinoLogger = pino(pinoPretty(this.getPinoConfig()));
    this.logger = pinoLogger;
  }

  setApplication(app: string): void {
    this.app = app;
  }

  setGlobalParameters(input: object): void {
    this.logger.setBindings(input);
  }

  getGlobalParameters<T>(): T {
    return this.logger.bindings() as T;
  }

  log(message: string): void {
    this.logger.info(green(message));
  }

  debug({ message, context, obj = {} }: MessageType): void {
    Object.assign(obj, {
      context: context ?? obj?.['context'],
      createdAt: DateUtils.getISODateString(),
    });
    this.logger.debug([obj, gray(message)].find(Boolean), gray(message));
  }

  info({ message, context, obj = {} }: MessageType): void {
    Object.assign(obj, {
      context: context ?? obj?.['context'],
      createdAt: DateUtils.getISODateString(),
    });
    this.logger.info([obj, message].find(Boolean), message);
  }

  warn(input: MessageType): void {
    const { message, context, obj = {} } = input;
    Object.assign(obj, {
      context: context ?? obj?.['context'],
      createdAt: DateUtils.getISODateString(),
    });
    this.logger.warn([obj, message].find(Boolean), message);
  }

  error(error: ErrorType, message?: string): void {
    const errorResponse = this.getErrorResponse(error);

    const bidings = this.logger.bindings();

    const response =
      error instanceof BaseException
        ? {
            statusCode: error.statusCode,
            message: error?.message,
            ...error?.parameters,
          }
        : errorResponse?.value();

    const type = {
      Error: BaseException.name,
    }[error?.name];

    const messages = [message, response?.message, error.message].find(Boolean);

    if (error?.name === 'QueryFailedError') {
      Object.assign(error, { parameters: undefined });
    }

    const typeError = [
      type,
      error?.name === 'ZodError' ? ApiBadRequestException.name : error?.name,
    ].find(Boolean);
    this.logger.error(
      {
        ...response,
        context: error?.context,
        type,
        traceid: this.getTraceId(error),
        createdAt: DateUtils.getISODateString(),
        application: bidings?.application || this.app,
        stack: error.stack?.replace(/\n/g, ''),
        parameters: error?.parameters,
        message: typeof messages === 'string' ? [messages] : messages,
      },
      typeError,
    );
  }

  fatal(error: ErrorType, message?: string): void {
    const messages = [error.message, message].find(Boolean);

    const type = {
      Error: BaseException.name,
    }[error?.name];
    const typeError = [
      type,
      error?.name === 'ZodError' ? ApiBadRequestException.name : error?.name,
    ].find(Boolean);

    this.logger.fatal(
      {
        message: typeof messages === 'string' ? [messages] : messages,
        context: error?.context,
        type: error.name,
        traceid: this.getTraceId(error),
        createdAt: DateUtils.getISODateString(),
        application: this.app,
        stack: error.stack?.replace(/\n/g, ''),
      },
      typeError,
    );
    process.exit(1);
  }

  private getPinoConfig(): PrettyOptions {
    return {
      colorize: true,
      levelFirst: true,
      ignore: 'pid,hostname',
      messageFormat: (log: LogDescriptor, messageKey: string): string => {
        const message = log[String(messageKey)];
        if (this.app) {
          return `[${blue(this.app)}] ${message}`;
        }

        return message;
      },
    };
  }

  private getErrorResponse(error: ErrorType): any {
    const isFunction = typeof error?.getResponse === 'function';
    return [
      {
        conditional: typeof error === 'string',
        value: () => new InternalServerErrorException(error).getResponse(),
      },
      {
        conditional: isFunction && typeof error.getResponse() === 'string',
        value: () =>
          new BaseException(
            error.getResponse() as string,
            [error.getStatus(), error['status']].find(Boolean),
          ).getResponse(),
      },
      {
        conditional: isFunction && typeof error.getResponse() === 'object',
        value: () => error?.getResponse(),
      },
      {
        conditional: [
          error?.name === Error.name,
          error?.name == TypeError.name,
        ].some(Boolean),
        value: () =>
          new InternalServerErrorException(error.message).getResponse(),
      },
    ].find((c) => c.conditional);
  }

  private getTraceId(error: string | { traceid: string }): string {
    if (typeof error === 'string') return UUIDUtils.create();
    return [error.traceid, this.logger.bindings()?.traceid].find(Boolean);
  }
}
