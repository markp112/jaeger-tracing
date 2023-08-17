// import { initializeTracing } from './tracing/tracing';
// const tracer = initializeTracing('node-app', 'development');
import express, { Request, Response }  from 'express';
import pinoHttp from 'pino-http';
import { logger } from './logger/logger';
import bodyParser from 'body-parser';
import { authRouter } from './api/auth/auth';
// import { PrismaClient } from '@prisma/client';

const app = express();
app.use(pinoHttp({
  logger,
  level: 'info'
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(authRouter);

// const prisma = new PrismaClient({});


app.get('/', (req, res) => {
  logger.info('app running');
  res.send('Hello World!');
});

app.use((req, res) => {
	logger.error(res.statusMessage);
	return res.status(404).json({
		message: 'Route not found',
		status: '404',
	});
});


export { app };
