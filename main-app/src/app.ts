import { initializeTracing } from './tracing/tracing';
const tracer = initializeTracing('main-app', 'test');

import express, { Request, Response }  from 'express';
import { logger } from './logger/logger';
import pino from 'pino-http';
import { PrismaClient } from '@prisma/client';
import { authRouter } from './api/auth/auth';
import bodyParser from 'body-parser';

const app = express();
app.use(pino);

const prisma = new PrismaClient({});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.status(200).send('Hello World!');
});

app.use(authRouter);

app.get('/users/random', async (_req: Request, res: Response) => {
  logger.info('/users/random - called');
  await tracer.startActiveSpan('Get /users/random', async (requestSpan) => {
    try {
      let users = await prisma.user.findMany({
        include: {
          posts: true,
        },
      });

      // select 10 users randomly
      const shuffledUsers = users.sort(() => 0.5 - Math.random());
      const selectedUsers = shuffledUsers.slice(0, 10);
      requestSpan.setAttribute('http.status', 200);
      res.status(200).json(selectedUsers);
    } catch (e) {
      requestSpan.setAttribute('http.status', 500);
      res.status(500).json({ error: 500, details: e });
    } finally {
      requestSpan.end();
    }
  });
});


export { app };
