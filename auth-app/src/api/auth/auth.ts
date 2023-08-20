import express, {Request, Response} from 'express';
import { logger } from '../../logger/logger';
import { AuthService } from '@core/services/auth/auth.service';
import { AuthRepository } from '@core/repositories/auth/auth.repository';
import { Credential } from '@core/models/auth/auth.model';
import { PrismaClient } from '@prisma/client';
import { tracer } from '../../tracing';
import { HTTP_STATUS } from './common/httpStatus/httpStatusCodes';

const authRouter = express.Router();
const ROUTE_PATH = '/auth';
const DELAY = 1000;

const getPath = (pathToAppend: string) => `${ROUTE_PATH}/${pathToAppend}`; 

const getDelay = () => {
  const delay = process.env.WAIT_DELAY;
  return delay ? parseInt(delay) : DELAY;  
}

authRouter.post(getPath('login'), async (req: Request, res: Response) => {
  await tracer.startActiveSpan('Post /auth/user', async (requestSpan) => {
    try {
      const bodyData = req.body;
			req.log.info(`auth/user called with ${bodyData}`);
      if (!bodyData) {
        logger.error('invalid credentials - Missing');
        res.status(HTTP_STATUS.BAD_REQUEST).send('missing credentials')
      }
      const waitDelay = getDelay();
      const credentials: Credential = bodyData;
      const prisma = new PrismaClient();
      const authService = new AuthService(new AuthRepository(prisma));
      const loggedIn = await authService.login(credentials, waitDelay);
      requestSpan.setAttribute('http.status', HTTP_STATUS.OK);
      res.status(HTTP_STATUS.OK).send(loggedIn);
    } catch (e) {
      requestSpan.setAttribute('http.status', HTTP_STATUS.SERVER_ERROR);
      res.status(HTTP_STATUS.SERVER_ERROR).json({ error: HTTP_STATUS.SERVER_ERROR, details: e });
    } finally {
      requestSpan.end();
		}  
  });
});

export { authRouter };
