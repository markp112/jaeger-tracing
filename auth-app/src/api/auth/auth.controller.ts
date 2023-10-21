import { Request, Response } from 'express';
import { traceRequest } from '@api/tracing/decorators';
import { logger } from '@logger/logger';
import { PrismaClient } from '.prisma/client';
import { UserPermission, UserType } from '@core/models/auth/auth.model';
import { AuthRepository } from '@core/repositories/auth/auth.repository';
import { HttpStatusCode } from 'axios';
import { AuthService } from '@core/services/auth/auth.service';

type Result<T> = {
  count: number;
  data: T;
};

export class AuthApi {
  private static prismaClient = new PrismaClient();
  private static authService = new AuthService(
    new AuthRepository(this.prismaClient)
  );

  private static getResult<T>(data: T): Result<T> {
    let records = 1;
    if (Array.isArray(data)) {
      records = data.length;
    }
    return {
      count: records,
      data,
    };
  }

  @traceRequest('/user/:name')
  static async getUser(req: Request, res: Response): Promise<void> {
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
      const error = JSON.stringify(err);
      res.status(HttpStatusCode.InternalServerError).send(error);
    }
  }

  @traceRequest('/user/:id/permissions/:permission')
  static async getUserPermission(req: Request, res: Response): Promise<void> {
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
      const error = JSON.stringify(err);
      res.status(HttpStatusCode.InternalServerError).send(error);
    }
  }
}
