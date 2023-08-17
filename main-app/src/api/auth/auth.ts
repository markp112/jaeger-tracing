
// import { tracer } from '../../tracing';
import express, {Request, Response} from 'express';
import { logger } from '../../logger/logger';
import { AuthRepository } from '@core/repository/auth/auth.repository';
import { AuthService } from '@core/service/auth/auth.service';
import { Credential } from '@model/auth/auth.model';
import { Config } from '../../config/config';

const authRouter = express.Router();
const ROUTE_PATH = '/auth';

const getPath = (pathToAppend: string) => `${ROUTE_PATH}/${pathToAppend}`; 

authRouter.post(getPath('login'), async (req: Request, res: Response) => {
  logger.child({name: 'Auth'});
  req.log.info('login called');
  // await tracer.startActiveSpan('Post auth/login', async (requestSpan) => {
    try {
      const bodyData = req.body;
      const baseUrl = new Config.AuthUrl().getUrl();
      console.log('%c⧭', 'color: #00a3cc', baseUrl);
      if (!bodyData) {
        logger.error('invalid credentials - Missing');
        res.status(400).send('missing credentials')
      }
      if (bodyData.userName) {
        const credentials: Credential = bodyData;
        const authService = new AuthService(new AuthRepository(baseUrl));
        const loggedIn = await authService.login(credentials);
        res.status(200).send(loggedIn);
      }
    } catch(e) {
      // requestSpan.setAttribute('http.status', 500);
      res.status(500).json({ error: 500, details: e });

    }    // } finally {
    //   requestSpan.end();
    // }
  // });
});

export { authRouter };
