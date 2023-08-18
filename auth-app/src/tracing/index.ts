import { initializeTracing } from './tracing';
const tracer = initializeTracing('auth-app', 'test');

export { tracer };
