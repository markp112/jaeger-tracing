import { initializeTracing } from './tracing/tracing';
const tracer = initializeTracing('node-app', 'development');
import express, { Request, Response }  from 'express';
import { logger } from './logger/logger'; 
import { PrismaClient } from '@prisma/client';
import { authRouter } from './api/auth/auth';

const app = express();

const prisma = new PrismaClient({});


app.get('/', (req, res) => {
  logger.info('app running');
  res.send('Hello World!');
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
