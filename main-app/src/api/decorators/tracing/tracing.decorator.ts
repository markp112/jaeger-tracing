import { logger } from '@logger/logger';
import { tracer } from '../../../tracing';

function traceRequest(endPoint: string) {
  return function (
    target: Object,
    prop: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    let method = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      return await tracer.startActiveSpan(endPoint, async (requestSpan) => {
        try {
          if (typeof method === 'function') {
            const returnValue = await method.apply(this, args);
            return returnValue;
          }
        } catch (e) {
          logger.error(e);
          requestSpan.setAttribute('http.status', 500);
          requestSpan.recordException(`${(e as Error).message}`);
        } finally {
          requestSpan.end();
        }
      });
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
      return await tracer.startActiveSpan(endPoint, async (requestSpan) => {
        try {
          if (typeof method === 'function') {
            const returnValue = await method.apply(this, args);
            return returnValue;
          }
        } catch (e) {
          logger.error(e);
          requestSpan.setAttribute('http.status', 500);
          requestSpan.recordException(`${(e as Error).message}`);
        } finally {
          requestSpan.end();
        }
      });
    };
  };
}

export { traceRequest };
