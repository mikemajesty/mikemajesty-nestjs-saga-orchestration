import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { ILoggerAdapter } from '@/infra/logger';
import { UUIDUtils } from '@/utils/uuid';


@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(
    private readonly loggerService: ILoggerAdapter,
  ) {}
  async use(
    request: Request & { user: unknown; id: string },
    response: Response,
    next: NextFunction
  ): Promise<void> {
    const tokenHeader = request.headers.authorization;

    if (!request.headers?.traceid) {
      Object.assign(request.headers, { traceid: request['id'] ?? UUIDUtils.create() });
    }

    const token = tokenHeader.split(' ')[1];

    request.id = request.headers.traceid as string;

    next();
  }
}
