import { Request, Response } from 'express';
import { traceRequest } from '@api/tracing/decorators';
import { logger } from '@logger/logger';
import { UserPermission, UserType } from '@core/models/auth/auth.model';
import { HttpStatusCode } from 'axios';
import { AuthServiceInterface } from '@core/services/auth/auth.service';
import { BaseController } from '@api/common/responseResult';

export class AuthController extends BaseController{
  constructor(private authService: AuthServiceInterface) {
        super();
      }

  @traceRequest('/user/:name')
  async getUser(req: Request, res: Response): Promise<void> {
    logger.info(`${req.originalUrl} - called`);
    try {
      const name = req.params.name;
      const user: UserType | undefined = await this.authService.getUser(name);
      if (user) {
        const result = this.getResult<UserType>(user);
        res.status(HttpStatusCode.Ok).send(result);
      }
      res.status(HttpStatusCode.NotFound).send();
    } catch (err) {
      this.logAndSendError(err as Error, res);
    }
  }

  @traceRequest('/user/:id/permissions/:permission')
  async getUserPermission(req: Request, res: Response): Promise<void> {
    logger.info(`${req.originalUrl} - called`);
    try {
      const permissionRequested: UserPermission = {
        userId: req.params.id,
        permission: req.params.permission,
      };
      const userPermission = await this.authService.getUserPermission(
        permissionRequested
      );
      const result = this.getResult<UserPermission>(userPermission);
      res.status(HttpStatusCode.Ok).send(result);
    } catch (err) {
      this.logAndSendError(err as Error, res);
    }
  }

}
