import { initializeTracing } from './tracing';
const tracer = initializeTracing('main-app', 'test');

export { tracer };
