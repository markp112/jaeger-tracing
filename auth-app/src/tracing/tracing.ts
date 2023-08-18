import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import {
  SimpleSpanProcessor,
  BatchSpanProcessor,
  TraceIdRatioBasedSampler,
  //   EXPORTER_FACTORY,
} from '@opentelemetry/sdk-trace-base';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import {
  diag,
  DiagConsoleLogger,
  DiagLogLevel,
  trace,
  Tracer,
} from '@opentelemetry/api';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { PrismaInstrumentation } from '@prisma/instrumentation';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

export function initializeTracing(
  serviceName: string,
  environment: string
): Tracer {
  const traceRatio = process.env.NODE_ENV === 'production' ? 0.1 : 1.0;

  const endpoint =
    process.env.JAEGER_END_POINT ?? 'http://jaeger-all-in-one-inmemory-collector.jaeger.svc:14268/api/traces';

  const jaegerExporter = new JaegerExporter({ endpoint });
  const provider = new NodeTracerProvider({
    sampler: new TraceIdRatioBasedSampler(traceRatio),
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
      [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: environment,
    }),
  });

  if (process.env.NODE_ENV === 'production') {
    provider.addSpanProcessor(new BatchSpanProcessor(jaegerExporter));
  } else {
    provider.addSpanProcessor(new SimpleSpanProcessor(jaegerExporter));
  }

  registerInstrumentations({
    instrumentations: [
      new HttpInstrumentation(),
      new ExpressInstrumentation(),
      new PrismaInstrumentation(),
    ],
    tracerProvider: provider,
  });

  provider.register();

  return trace.getTracer(serviceName);
  // return provider.getTracer(serviceName);
}
