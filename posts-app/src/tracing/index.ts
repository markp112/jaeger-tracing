import { initializeTracing } from './tracing';
const tracer = initializeTracing('post-app', 'local host');

export { tracer };
