import { Request, Response } from 'express';
import { traceRequest } from '@api/tracing/decorators';
import { logger } from '../../logger/logger';
import { HttpStatusCode } from 'axios';
import { Authentication } from '@core/repository/auth/auth.repository';
import { UserPermission } from '@core/services/models/auth/auth.model';
import { PostsServiceInterface } from '@core/services/posts/posts.service';
import { BaseController } from '@api/common/responseResult';

export class PostsController extends BaseController {
  constructor(
    private authService: Authentication,
    private postsService: PostsServiceInterface
  ) {
    super();
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
      this.logAndSendError(err as Error, res);
    }
  }

  @traceRequest('/posts')
  async getAllPosts(req: Request, res: Response): Promise<void> {
    logger.info(`${req.originalUrl} - called`);
    try {
      const posts = await this.postsService.getAllPosts();
      res.status(HttpStatusCode.Ok).send(this.getResult(posts));
    } catch (err) {
      this.logAndSendError(err as Error, res);
    }
  }
}
