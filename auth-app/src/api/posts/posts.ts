import express, { Request, Response } from 'express';
import { logger } from '../../logger/logger';
import { PrismaClient } from '@prisma/client';
import { tracer } from '../../tracing';
import { PostOneService, PostService } from '@core/services/posts/post.service';
import { PostRepository } from '@core/repositories/posts/post.repository';
import { PostsOneRepository } from '@core/repositories/posts/postsOne.repository';
import { Config } from '@api/config/config';
import { HttpStatusCode } from 'axios';

const postsRouter = express.Router();
const ROUTE_PATH = '/posts';

const getPath = (pathToAppend: string) => `${ROUTE_PATH}/${pathToAppend}`;

postsRouter.get(getPath(''), async (req: Request, res: Response) => {
  await tracer.startActiveSpan('Get /posts', async (requestSpan) => {
    try {
      const prisma = new PrismaClient();
      const postService = new PostService(new PostRepository(prisma));
      const posts = await postService.fetchPosts();
      logger.info(`posts retrieved -->${JSON.stringify(posts)}`);
      requestSpan.setAttribute('http.status', HttpStatusCode.Ok);
      const resp = {
        status: HttpStatusCode.Ok,
        data: posts,
      };
      res.status(HttpStatusCode.Ok).send(JSON.stringify(resp));
    } catch (err) {
      const errMsg = (err as Error).message;
      logger.error(`Error returned from service: --> ${errMsg}`);
      requestSpan.setAttribute(
        'http.status',
        HttpStatusCode.InternalServerError
      );
      requestSpan.recordException(errMsg);
      res.status(HttpStatusCode.InternalServerError).json({
        error: HttpStatusCode.InternalServerError,
        details: errMsg,
      });
    } finally {
      requestSpan.end();
    }
  });
});

postsRouter.get(getPath('posts-1'), async (req: Request, res: Response) => {
  await tracer.startActiveSpan('Get /posts', async (requestSpan) => {
    try {
      const url = new Config.PostUrl().getUrl();
      const postService = new PostOneService(new PostsOneRepository(url));
      const posts = await postService.fetchPosts('posts/post-2');
      logger.info(`posts retrieved -->${JSON.stringify(posts)}`);
      requestSpan.setAttribute('http.status', HttpStatusCode.Ok);
      const resp = {
        status: HttpStatusCode.Ok,
        data: posts,
      };
      res.status(HttpStatusCode.Ok).send(JSON.stringify(resp));
    } catch (err) {
      const errMsg = (err as Error).message;
      logger.error(`Error returned from service: --> ${errMsg}`);
      requestSpan.setAttribute(
        'http.status',
        HttpStatusCode.InternalServerError
      );
      requestSpan.recordException(errMsg);
      res.status(HttpStatusCode.InternalServerError).json({
        error: HttpStatusCode.InternalServerError,
        details: errMsg,
      });
    } finally {
      requestSpan.end();
    }
  });
});

export { postsRouter };
