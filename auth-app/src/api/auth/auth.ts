import express, {Request, Response} from 'express';
import { logger } from '../../logger/logger';
import { AuthService } from '@core/services/auth/auth.service';
import { AuthRepository } from '@core/repositories/auth/auth.repository';
import { Credential } from '@core/models/auth/auth.model';
import { PrismaClient } from '@prisma/client';
import { tracer } from 'tracing';

const authRouter = express.Router();
const ROUTE_PATH = '/auth';

const getPath = (pathToAppend: string) => `${ROUTE_PATH}/${pathToAppend}`; 

authRouter.post(getPath('login'), async (req: Request, res: Response) => {
  await tracer.startActiveSpan('Post /auth/user', async (requestSpan) => {
    try {
      const bodyData = req.body;
			req.log.info(`auth/user called with`, bodyData);
      if (!bodyData) {
        logger.error('invalid credentials - Missing');
        res.status(400).send('missing credentials')
      }
      const delay = process.env.WAIT_DELAY;
      let waitDelay = 2000;
      if (delay) {
        waitDelay = parseInt(delay);
      }
      const credentials: Credential = bodyData;
      const prisma = new PrismaClient();
      const authService = new AuthService(new AuthRepository(prisma));
      const loggedIn = await authService.login(credentials, waitDelay);
      requestSpan.setAttribute('http.status', 200);
      res.status(200).send(loggedIn);
    } catch (e) {
      requestSpan.setAttribute('http.status', 500);
      res.status(500).json({ error: 500, details: e });
    } finally {
      requestSpan.end();
		}  
  });
});

export { authRouter };
