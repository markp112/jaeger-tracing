import express, {Request, Response} from 'express';
import { logger } from '../../logger/logger';
import { AuthService } from '@core/services/auth/auth.service';
import { AuthRepository } from '@core/repositories/auth/auth.repository';
import { Credential } from '@core/models/auth/auth.model';

const authRouter = express.Router();
const ROUTE_PATH = '/auth';

const getPath = (pathToAppend: string) => `${ROUTE_PATH}/${pathToAppend}`; 

authRouter.post(getPath('login'), async (req: Request, res: Response) => {
  req.log.info('login called');
  const bodyData = req.body;
  if (!bodyData) {
    logger.error('invalid credentials - Missing');
    res.status(400).send('missing credentials')
  }
  // if (bodyData.userName) {
    const credentials: Credential = bodyData;
    const authService = new AuthService(new AuthRepository());
    const loggedIn = await authService.login(credentials);
    res.status(200).send(loggedIn);
  // }
});

export { authRouter };
