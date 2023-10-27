import { logger } from '@logger/logger';
import { tracer } from '../../../tracing';
import { HttpStatusCode } from 'axios';
import { Span } from '@opentelemetry/api';

function traceRequest(endPoint: string) {
  return function (
    target: Object,
    prop: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    let method = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      return await tracer.startActiveSpan(
        endPoint,
        async (requestSpan: Span) => {
          try {
            if (typeof method === 'function') {
              const returnValue = await method.apply(this, args);
              return returnValue;
            }
          } catch (e) {
            logger.error(`Error logged from traceRequest -> ${e}`);
            requestSpan.setAttribute(
              'http.status',
              HttpStatusCode.InternalServerError
            );
            requestSpan.recordException(`${(e as Error).message}`);
          } finally {
            requestSpan.end();
          }
        }
      );
    };
  };
}

function captureSpan(endPoint: string) {
  return function (
    target: Object,
    prop: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    let method = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      return await tracer.startActiveSpan(
        endPoint,
        async (requestSpan: Span) => {
          try {
            if (typeof method === 'function') {
              const returnValue = await method.apply(this, args);
              return returnValue;
            }
          } catch (e) {
            logger.error(e);
            requestSpan.setAttribute(
              'http.status',
              HttpStatusCode.InternalServerError
            );
            requestSpan.recordException(`${(e as Error).message}`);
          } finally {
            requestSpan.end();
          }
        }
      );
    };
  };
}

export { traceRequest, captureSpan };
