import express from 'express';
import { initialiseServices } from '@init/init';

const authRouter = express.Router();
const authController = initialiseServices().authController;
const ROUTE_PATH = '/auth';

const getPath = (pathToAppend: string) => `${ROUTE_PATH}/${pathToAppend}`;

authRouter.get(getPath('user/:name'), authController.getUser.bind(authController));
authRouter.get(
  getPath('user/:id/permission/:permission'),
  authController.getUserPermission.bind(authController)
);

export { authRouter };
