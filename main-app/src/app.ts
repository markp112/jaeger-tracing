import express from 'express';
import pinoHttp from 'pino-http';
import { authRouter } from './api/auth/auth';
import bodyParser from 'body-parser';
import { logger } from '@logger/logger';
import { postsRouter } from '@api/posts/posts';
import { metricsMiddleware } from './prometheus/promClient';

const app = express();
app.use(
  pinoHttp({
    logger,
    level: 'info',
  })
);

app.use(metricsMiddleware);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(authRouter);
app.use(postsRouter);

app.get('/', (req, res) => {
  res.status(200).send('Hello World!');
});

export { app };
