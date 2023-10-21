import express from 'express';
import { AuthApi } from './auth.controller';

const authRouter = express.Router();
const ROUTE_PATH = '/auth';

const getPath = (pathToAppend: string) => `${ROUTE_PATH}/${pathToAppend}`;

authRouter.get(getPath('user/:name'), AuthApi.getUser);
authRouter.get(
  getPath('user/:id/permission/:permission'),
  AuthApi.getUserPermission
);

export { authRouter };
