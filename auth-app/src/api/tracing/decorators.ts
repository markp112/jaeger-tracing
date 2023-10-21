import { HttpStatusCode } from 'axios';
import { tracer } from '../../tracing';

export function traceRequest(endPoint: string) {
  return function (
    target: Object,
    prop: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    let method = descriptor.value;
    descriptor.value = async function () {
      return await tracer.startActiveSpan(endPoint, async (requestSpan) => {
        try {
          if (typeof method === 'function') {
            const returnValue = await method.apply(this, arguments);
            return returnValue;
          }
        } catch (e) {
          requestSpan.setAttribute(
            'http.status',
            HttpStatusCode.InternalServerError
          );
          requestSpan.recordException(`${(e as Error).message}`);
        } finally {
          requestSpan.end();
        }
      });
    };
  };
}
