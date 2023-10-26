import { Request, Response } from 'express';
import { traceRequest } from '@api/tracing/decorators';
import { logger } from '../../logger/logger';
import { PrismaClient } from '@prisma/client';
import { Config } from '@api/config/config';
import { HttpStatusCode } from 'axios';
import { AuthService } from '@core/services/auth/auth.service';
import { AuthRepository } from '@core/repository/auth/auth.repository';
import { UserPermission } from '@core/services/models/auth/auth.model';
import { PostsRepository } from '@core/repository/posts/posts.repository';
import { PostsService } from '@core/services/posts/posts.service';
import { trace } from '@opentelemetry/api';

type Result<T> = {
  count: number;
  data: T;
};

export class PostsController {
  private static prismaClient = new PrismaClient();
  private static postsService = new PostsService(
    new PostsRepository(this.prismaClient)
  );
  private static uri = new Config.AuthUrl().getUrl();
  private static authService = new AuthService(new AuthRepository(this.uri));

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

  @traceRequest('/posts/:userId/:permission')
  static async getUserPosts(req: Request, res: Response): Promise<void> {
    logger.info(`${req.originalUrl} - called`);
    try {
      const userPermission: UserPermission = {
        userId: req.params.userId,
        permission: req.params.permission,
      };
      const permissionGranted = await this.authService.getUserPermission(
        userPermission
      );
      if (permissionGranted.isGranted) {
        const posts = await this.postsService.getUserPosts(
          userPermission.userId
        );
        res.status(HttpStatusCode.Ok).send(this.getResult(posts));
      }
      res.status(HttpStatusCode.NotFound).send();
    } catch (err) {
      const error = JSON.stringify(err);
      res.status(HttpStatusCode.InternalServerError).send(error);
    }
  }

  @traceRequest('/posts')
  static async getAllPosts(req: Request, res: Response): Promise<void> {
    logger.info(`${req.originalUrl} - called`);
    try {
      const posts = await this.postsService.getAllPosts();
      res.status(HttpStatusCode.Ok).send(this.getResult(posts));
    } catch (err) {
      const error = JSON.stringify(err);
      res.status(HttpStatusCode.InternalServerError).send(error);
    }
  }
}
