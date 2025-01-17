import {
  ArgumentsHost,
  Catch,
  Logger,
  RpcExceptionFilter,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { KafkaJSNumberOfRetriesExceeded } from 'kafkajs';
import { Observable, of, throwError } from 'rxjs';

@Catch(KafkaJSNumberOfRetriesExceeded)
export class KafkaJSNumberOfRetriesFilter implements RpcExceptionFilter<KafkaJSNumberOfRetriesExceeded> {
  catch(exception: KafkaJSNumberOfRetriesExceeded, host: ArgumentsHost): Observable<any> {
    const ctx = host.switchToRpc();
    const message = ctx.getData();

    // Logar o erro
    console.error('KafkaJS NumberOfRetriesExceeded:', exception, message);
    return of(exception);
  }
}