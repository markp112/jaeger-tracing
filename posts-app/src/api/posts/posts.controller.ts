import { Request, Response } from 'express';
import { traceRequest } from '@api/tracing/decorators';
import { logger } from '../../logger/logger';
import { HttpStatusCode } from 'axios';
import { Authentication } from '@core/repository/auth/auth.repository';
import { UserPermission } from '@core/services/models/auth/auth.model';
import { PostsServiceInterface } from '@core/services/posts/posts.service';

type Result<T> = {
  count: number;
  data: T;
};

const ERROR_MESSAGE = 'request failed';

export class PostsController {
  constructor(
    private authService: Authentication,
    private postsService: PostsServiceInterface
  ) {}

  private getResult<T>(data: T): Result<T> {
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
  async getUserPosts(req: Request, res: Response): Promise<void> {
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
      logger.error(err);
      res
        .status(HttpStatusCode.InternalServerError)
        .send(this.getResult<string>(ERROR_MESSAGE));
    }
  }

  @traceRequest('/posts')
  async getAllPosts(req: Request, res: Response): Promise<void> {
    logger.info(`${req.originalUrl} - res called`);
    try {
      const posts = await this.postsService.getAllPosts();
      res.status(HttpStatusCode.Ok).send(this.getResult(posts));
    } catch (err) {
      logger.error(err);
      res
        .status(HttpStatusCode.InternalServerError)
        .send(this.getResult<string>(ERROR_MESSAGE));
    }
  }
}
