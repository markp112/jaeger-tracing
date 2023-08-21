import express from 'express';
import pinoHttp from 'pino-http';
import { authRouter } from './api/auth/auth';
import bodyParser from 'body-parser';
import { logger } from '@logger/logger';
import { postsRouter } from '@api/posts/posts';

const app = express();
app.use(
  pinoHttp({
    logger,
    level: 'info',
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.status(200).send('Hello World!');
});

app.use(authRouter);
app.use(postsRouter);

export { app };
