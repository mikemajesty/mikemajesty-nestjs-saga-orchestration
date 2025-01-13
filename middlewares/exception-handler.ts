import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { AxiosError } from 'axios';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ZodError } from 'zod';

import { ApiBadRequestException, ApiInternalServerException, ApiTimeoutException } from '@/utils/exception';

@Injectable()
export class ExceptionHandlerInterceptor implements NestInterceptor {
  intercept(executionContext: ExecutionContext, next: CallHandler): Observable<unknown> {

    return next.handle().pipe(
      catchError((error) => {

        const message = this.getMessage(error);

        error.status = this.getStatusCode(error);

        const headers = executionContext.getArgs()[0]?.headers;

        if (typeof error === 'object' && !error.traceid) {
          error.traceid = headers.traceid;
        }

        if (!error?.context) {
          const context = `${executionContext.getClass().name}/${executionContext.getHandler().name}`;
          error.context = context;
        }
        throw { ...error, message };
      })
    );
  }

  private getMessage(error: any) {
    if (error instanceof ZodError) {
      return error.issues.map((e: any) => `${e.message}: ${e.path.join(".")} expect [${e.expected ?? "N/A"}] but received: [${e.received ?? "N/A"}]`).join(", ")
    }

    return error.message ?? error
  }

  private getStatusCode(
    error: ZodError | AxiosError<{ code: string | number; error: { code: string | number } }>
  ): number {
    if (error instanceof ZodError) {
      return ApiBadRequestException.STATUS;
    }

    if (error?.code === 'ECONNABORTED' || error?.code === 'ECONNRESET') {
      return ApiTimeoutException.STATUS;
    }

    return [
      error.status,
      error?.response?.status,
      error?.response?.data?.code,
      error?.response?.data?.error?.code,
      ApiInternalServerException.STATUS
    ].find(Boolean) as number;
  }
}