import * as client from 'prom-client';
// import promBundle from 'express-prom-bundle';
// enable prom-client to expose default application metrics
const collectDefaultMetrics = client.collectDefaultMetrics;

// define a custom prefix string for application metrics
collectDefaultMetrics({ prefix: 'main_app:' });

const histogram = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds histogram',
  labelNames: ['method', 'handler', 'code'],
  buckets: [0.1, 5, 15, 50, 100, 500],
});

export { histogram, client };

// const metricsMiddleware = promBundle({
//   includeMethod: true,
//   includePath: true,
//   includeStatusCode: true,
//   includeUp: true,
//   customLabels: {
//     project_name: 'hello_world',
//     project_type: 'test_metrics_labels',
//   },
//   promClient: {
//     collectDefaultMetrics: {},
//   },
// });

// export { metricsMiddleware };
