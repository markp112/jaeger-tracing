import { Request, Response } from 'express';
import { traceRequest } from '@api/decorators/tracing/tracing.decorator';
import {
  PostsService,
  PostsServiceInterface,
} from '@core/service/posts/posts.service';
import { PostType } from '@model/posts/posts.model';
import { PostsRepository } from '@repository/posts/posts.repository';
import { Config } from '../../config/config';
import { logger } from '@logger/logger';
import { Authentication } from '@repository/auth/auth.repository';
import { UserPermission, UserType } from '@model/auth/auth.model';
import { HttpStatusCode } from 'axios';
import { BaseController, ResultType } from '@api/common/responseResult';

export class PostController extends BaseController {
  constructor(
    private authService: Authentication,
    private postsService: PostsServiceInterface,
  ) {
    super();
  }

  @traceRequest('posts/user/:username')
  async getUserPosts(req: Request, res: Response): Promise<void> {
    logger.child({ name: 'getUserPosts' });
    try {
      const userName = req.params.username;
      const user = await this.authService.getUser(userName);
      const userPermission = await this.getUserPermissions(user);
      const result = await this.getPosts(userPermission);
      if (this.isAuthorised(result.data)) {
        res.status(HttpStatusCode.Ok).send(result);
      } else {
        res.status(HttpStatusCode.Unauthorized).send(result);
      }
    } catch (err) {
      this.logAndSendError(err as Error, res);
    }
  }

  @traceRequest('getAllPosts')
  async getAllPosts(req: Request, res: Response): Promise<void> {
    logger.info(`${req.originalUrl} -- called`);
    try {
      const postResult: PostType[] = await this.postsService.fetchAllPosts();
      res
        .status(HttpStatusCode.Ok)
        .send(this.getResult<PostType[]>(postResult));
    } catch (err) {
      this.logAndSendError(err as Error, res);
    }
  }

  @traceRequest('getRoundTripPosts')
  async getRoundTripPosts(req: Request, res: Response): Promise<void> {
    logger.info(`${req.originalUrl} -- called`);
    try {
      const postResult: PostType[] = await this.postsService.fetchPostsOne();
      if (postResult) {
        res
          .status(HttpStatusCode.Ok)
          .send(this.getResult<PostType[]>(postResult));
      }
    } catch (err) {
      this.logAndSendError(err as Error, res);
    }
  }

  async noTrace(req: Request, res: Response): Promise<void> {
    req.log.child({ name: 'no-trace' });
    req.log.info('no-trace called');
    try {
      const baseUrl = new Config.AuthUrl().getUrl();
      const postsService = new PostsService(new PostsRepository(baseUrl));
      const postResult: PostType[] = await postsService.fetchAllPosts();
      if (postResult) {
        res
          .status(HttpStatusCode.Ok)
          .send(this.getResult<PostType[]>(postResult.slice(0, 10)));
      }
    } catch (err) {
      this.logAndSendError(err as Error, res);
    }
  }

  private async getUserPermissions(user: UserType): Promise<UserPermission> {
    const permission: UserPermission = {
      userId: user.id,
      permission: 'read-posts',
    };
    return await this.authService.getUserPermissions(permission);
  }

  private async getPosts(
    permission: UserPermission
  ): Promise<ResultType<PostType[] | string>> {
    if (permission.isGranted) {
      const posts = await this.postsService.fetchPosts(permission);
      return this.getResult<PostType[]>(posts);
    } else {
      return this.getResult<string>(
        `user: ${permission.userId} is not authorised`
      );
    }
  }

  private isAuthorised(data: string | PostType[]): boolean {
    return typeof data !== 'string';
  }
}
