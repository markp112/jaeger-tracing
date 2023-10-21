import { tracer } from '../../../tracing';

function traceRequest(endPoint: string) {
  return function (
    target: any,
    prop: string,
    descriptor: TypedPropertyDescriptor<Function>
  ) {
    let method = descriptor.value;
    descriptor.value = async function () {
      return await tracer.startActiveSpan(endPoint, async (requestSpan) => {
        try {
          const returnValue = await method.apply(this, arguments);
          return returnValue;
        } catch (e) {
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
