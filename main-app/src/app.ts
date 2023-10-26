import express from 'express';
import pinoHttp from 'pino-http';
import bodyParser from 'body-parser';
import { logger } from '@logger/logger';
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

app.get('/', (req, res) => {
  res.status(200).send('Hello World!');
});

app.use((req, res) => {
  logger.error('route not found !!');
  return res.status(HttpStatusCode.NotFound).json({
    message: 'Route not found',
    status: `${HttpStatusCode.NotFound}`,
  });
});

export { app };
