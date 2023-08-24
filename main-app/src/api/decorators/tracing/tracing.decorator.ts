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
          // if (returnValue instanceof Promise) {
          //   (async () => {
          //     try {
          //       await returnValue;
          //     } catch (e) {
          //       throw new Error(e);
          //     }
          //   })();
          // }
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
// Side effect code here
//
// if ( returnValue instanceof Promise ) {
//   ( async () => {
//     try {
//       await returnValue;
//     } catch (e) {
//       console.error('e', e);

//       // alert(opts.i18nMessage);
//     }
//   } )();
// }

// return returnValue;
// }

// function traceRequest(target: Function, context) {
//   if (context.kind === 'method') {
//     return async function (...args: any[]) {
//       await tracer.startActiveSpan('Get posts/', async (requestSpan) => {
//         try {
//           return await target.apply(this, args);
//         } catch (e) {
//           requestSpan.setAttribute('http.status', 500);
//           requestSpan.recordException(`${(e as Error).message}`);
//         } finally {
//           requestSpan.end();
//         }
//       });
//     };
//   }
// }

export { traceRequest };
