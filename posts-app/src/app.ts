import { tracer } from './tracing';
import express from 'express';
import pinoHttp from 'pino-http';
import { logger } from './logger/logger';
import bodyParser from 'body-parser';
import { postsRouter } from '@api/posts/posts.api';
import { HttpStatusCode } from 'axios';

const app = express();
app.use(
  pinoHttp({
    logger,
    level: 'info',
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(postsRouter);

app.get('/', async (req, res) => {
  await tracer.startActiveSpan('Get /', async (requestSpan) => {
    try {
      logger.info('app running');
      requestSpan.setAttribute('http.status', HttpStatusCode.Ok);
      res.send('Hello World from post-app');
    } catch (e) {
      requestSpan.setAttribute(
        'http.status',
        HttpStatusCode.InternalServerError
      );
      res
        .status(HttpStatusCode.InternalServerError)
        .json({ error: HttpStatusCode.InternalServerError, details: e });
    } finally {
      requestSpan.end();
    }
  });
});

app.use((req, res) => {
  logger.error('route not found !!');
  return res.status(HttpStatusCode.NotFound).json({
    message: 'Route not found',
    status: `${HttpStatusCode.NotFound}`,
  });
});

export { app };
