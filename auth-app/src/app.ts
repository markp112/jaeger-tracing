import { tracer } from './tracing';
import express from 'express';
import pinoHttp from 'pino-http';
import { logger } from './logger/logger';
import bodyParser from 'body-parser';
import { authRouter } from './api/auth/auth';

const app = express();
app.use(pinoHttp({
  logger,
  level: 'info'
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(authRouter);


app.get('/', async (req, res) => {
	await tracer.startActiveSpan('Get /', async (requestSpan) => {
    try {
			logger.info('app running');
			requestSpan.setAttribute('http.status', 200);
			res.send('Hello World!');
		} catch (e) {
      requestSpan.setAttribute('http.status', 500);
      res.status(500).json({ error: 500, details: e });
    } finally {
      requestSpan.end();
		}
	});
});

app.use((req, res) => {
	logger.error(res.statusMessage);
	return res.status(404).json({
		message: 'Route not found',
		status: '404',
	});
});

export { app };
