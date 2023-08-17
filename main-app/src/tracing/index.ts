import { initializeTracing } from './tracing';
const tracer = initializeTracing('main-app', 'development');

export { tracer };
