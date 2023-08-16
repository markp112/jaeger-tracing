import pino from 'pino';

const logger = pino({
  name: 'jaeger-demo',
  level: 'debug',
});

export { logger };
