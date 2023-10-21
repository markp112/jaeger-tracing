import pino from 'pino';

const logger = pino({
  level: process.env.PINO_LOG_LEVEL || 'info',
  formatters: {
    bindings: (bindings) => {
      return {
        reqId: bindings.pid,
        node_version: process.version,
        hostName: bindings.hostname,
        level: bindings.label
      };
    },
      level: (label) => {
        return { level: label.toUpperCase() };
      }
  },
  transport: {
    target: 'pino-pretty',
    options: { colorize: true },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export { logger };
