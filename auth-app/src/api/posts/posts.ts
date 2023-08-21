import express, { Request, Response } from 'express';
import { logger } from '../../logger/logger';
import { PrismaClient } from '@prisma/client';
import { tracer } from '../../tracing';
import { HTTP_STATUS } from '../common/httpStatus/httpStatusCodes';
import { PostService } from '@core/services/posts/post.service';
import { PostRepository } from '@core/repositories/posts/post.repository';

const postsRouter = express.Router();
const ROUTE_PATH = '/posts';

const getPath = (pathToAppend: string) => `${ROUTE_PATH}/${pathToAppend}`;

postsRouter.post(getPath(''), async (req: Request, res: Response) => {
  await tracer.startActiveSpan('Post /posts', async (requestSpan) => {
    try {
      req.log.info(`posts/ called with`);
      const prisma = new PrismaClient();
      const postService = new PostService(new PostRepository(prisma));
      const posts = await postService.fetchPosts();
      logger.info(`posts retrieved -->${JSON.stringify(posts)}`);
      requestSpan.setAttribute('http.status', HTTP_STATUS.OK);
      res.status(HTTP_STATUS.OK).send(posts);
    } catch (err) {
      logger.error(`Error returned from service: --> ${err}`);
      requestSpan.setAttribute('http.status', (err as Error).message);
      requestSpan.setAttribute('authApp.error', (err as Error).message);
      res.status(HTTP_STATUS.SERVER_ERROR).json({
        error: HTTP_STATUS.SERVER_ERROR,
        details: (err as Error).message,
      });
    } finally {
      requestSpan.end();
    }
  });
});

export { postsRouter };
