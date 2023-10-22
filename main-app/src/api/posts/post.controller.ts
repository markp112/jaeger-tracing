import { Request, Response } from 'express';
import { traceRequest } from '@api/decorators/tracing/tracing.decorator';
import { PostsService } from '@core/service/posts/posts.service';
import { PostType } from '@model/posts/posts.model';
import { PostsRepository } from '@repository/posts/posts.repository';
import { Config } from '../../config/config';
import { logger } from '@logger/logger';
import { AuthService } from '@core/service/auth/auth.service';
import { AuthRepository } from '@repository/auth/auth.repository';
import { UserPermission, UserType } from '@model/auth/auth.model';
import { HttpStatusCode } from 'axios';

type Result<T> = {
  count: number;
  data: T;
};

const ERROR_MESSAGE = 'request failed';

export class PostController {
  private static authUrl = new Config.AuthUrl().getUrl();
  private static postUrl = new Config.PostUrl().getUrl();
  private static postsService = new PostsService(
    new PostsRepository(this.postUrl)
  );
  private static authService = new AuthService(
    new AuthRepository(this.authUrl)
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

  @traceRequest('posts/:username')
  static async getUserPosts(req: Request, res: Response): Promise<void> {
    logger.child({ name: 'getUserPosts' });
    try {
      const userName = req.params.userName;
      const user = await this.authService.getUser(userName);
      const userPermission = await this.getUserPermissions(user);
      const result = await this.getPosts(userPermission);
      if (typeof result.data !== 'string') {
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

  @traceRequest('get posts')
  static async getAllPosts(req: Request, res: Response): Promise<void> {
    logger.info('getAllPosts Called');
    try {
      const baseUrl = new Config.AuthUrl().getUrl();
      const postsService = new PostsService(new PostsRepository(baseUrl));
      const postResult: PostType[] = await postsService.fetchAllPosts();
      logger.info(`post result ${JSON.stringify(postResult)}`);
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
  static async getRoundTripPosts(req: Request, res: Response): Promise<void> {
    logger.info('getRoundTripPosts called');
    try {
      const baseUrl = new Config.AuthUrl().getUrl();
      const postsService = new PostsService(new PostsRepository(baseUrl));
      const postResult: PostType[] = await postsService.fetchPostsOne();
      logger.info(`post result ${JSON.stringify(postResult)}`);
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

  static async noTrace(req: Request, res: Response): Promise<void> {
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

  private static async getUserPermissions(
    user: UserType
  ): Promise<UserPermission> {
    const permission: UserPermission = {
      userId: user.id,
      permission: 'read-posts',
    };
    return await this.authService.getUserPermissions(permission);
  }

  private static async getPosts(
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
}
