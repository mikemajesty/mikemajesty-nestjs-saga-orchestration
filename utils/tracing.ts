import { ClientRequest, IncomingMessage, ServerResponse } from 'node:http';
import 'dotenv/config';
import { diag, DiagConsoleLogger, DiagLogLevel, Span } from '@opentelemetry/api';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { MongoDBInstrumentation } from '@opentelemetry/instrumentation-mongodb';
import { PgInstrumentation } from '@opentelemetry/instrumentation-pg';
import { RedisInstrumentation } from '@opentelemetry/instrumentation-redis-4';
import { Resource } from '@opentelemetry/resources';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { KafkaJsInstrumentation } from 'opentelemetry-instrumentation-kafkajs';
import { UUIDUtils } from './uuid';

type StartTracingInput = {
  name: string
  version: string
}

export const startTracing = (input: StartTracingInput) => {
  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR);

  const tracerExporter = new OTLPTraceExporter();

  const resource = new Resource({
    'service.name': input.name,
    'service.version': input.version
  });

  const sdk = new NodeSDK({
    resource,
    traceExporter: tracerExporter,
    instrumentations: [
      new KafkaJsInstrumentation(),
      new HttpInstrumentation(),
      new RedisInstrumentation(),
      new MongoDBInstrumentation(),
      new PgInstrumentation()
    ]
  });

  sdk.start();

  process.on('SIGTERM', () => {
    sdk
      .shutdown()
      .then(() => console.error('Tracing terminated'))
      .catch((error) => console.error('Error terminating tracing', error))
      .finally(() => process.exit(0));
  });
}

