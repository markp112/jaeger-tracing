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

type Result<T> = {
  count: number;
  data: T;
};

const ERROR_MESSAGE = 'request failed';

export class PostController {
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
      logger.error(err);
      res
        .status(HttpStatusCode.InternalServerError)
        .send(this.getResult<string>(ERROR_MESSAGE));
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
      logger.error(err);
      res
        .status(HttpStatusCode.InternalServerError)
        .send(this.getResult<string>(ERROR_MESSAGE));
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
          .send(this.getResult<PostType[]>(postResult.slice(0, 10)));
      }
    } catch (err) {
      logger.error(err);
      res
        .status(HttpStatusCode.InternalServerError)
        .send(this.getResult<string>(ERROR_MESSAGE));
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
      logger.error(err);
      res
        .status(HttpStatusCode.InternalServerError)
        .send(this.getResult<string>(ERROR_MESSAGE));
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
  ): Promise<Result<PostType[] | string>> {
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
