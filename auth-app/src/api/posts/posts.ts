import express, { Request, Response } from 'express';
import { logger } from '../../logger/logger';
import { PrismaClient } from '@prisma/client';
import { tracer } from '../../tracing';
import { HTTP_STATUS } from '../common/httpStatus/httpStatusCodes';
import { PostOneService, PostService } from '@core/services/posts/post.service';
import { PostRepository } from '@core/repositories/posts/post.repository';
import {
  ApiRepository,
  PostsOneRepository,
} from '@core/repositories/posts/postsOne.repository';

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
      requestSpan.setAttribute('http.status', HTTP_STATUS.OK);
      const resp = {
        status: HTTP_STATUS.OK,
        data: posts,
      };
      res.status(HTTP_STATUS.OK).send(JSON.stringify(resp));
    } catch (err) {
      const errMsg = (err as Error).message;
      logger.error(`Error returned from service: --> ${errMsg}`);
      requestSpan.setAttribute('http.status', HTTP_STATUS.NOT_AVAILABLE);
      requestSpan.recordException(errMsg);
      res.status(HTTP_STATUS.NOT_AVAILABLE).json({
        error: HTTP_STATUS.NOT_AVAILABLE,
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
      const postService = new PostOneService(
        new PostsOneRepository('http://localhost:3000')
      );
      const posts = await postService.fetchPosts('posts');
      logger.info(`posts retrieved -->${JSON.stringify(posts)}`);
      requestSpan.setAttribute('http.status', HTTP_STATUS.OK);
      const resp = {
        status: HTTP_STATUS.OK,
        data: posts,
      };
      res.status(HTTP_STATUS.OK).send(JSON.stringify(resp));
    } catch (err) {
      const errMsg = (err as Error).message;
      logger.error(`Error returned from service: --> ${errMsg}`);
      requestSpan.setAttribute('http.status', HTTP_STATUS.NOT_AVAILABLE);
      requestSpan.recordException(errMsg);
      res.status(HTTP_STATUS.NOT_AVAILABLE).json({
        error: HTTP_STATUS.NOT_AVAILABLE,
        details: errMsg,
      });
    } finally {
      requestSpan.end();
    }
  });
});

export { postsRouter };
