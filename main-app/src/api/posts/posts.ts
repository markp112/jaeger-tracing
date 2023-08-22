import { tracer } from '../../tracing';
import { PostsService } from '@core/service/posts/posts.service';
import { logger } from '@logger/logger';
import { PostsRepository } from '@repository/posts/posts.repository';
import { Config } from '../../config/config';
import express, { Request, Response } from 'express';

const postsRouter = express.Router();
const ROUTE_PATH = '/posts';

const getPath = (pathToAppend: string) => `${ROUTE_PATH}/${pathToAppend}`;

postsRouter.get(getPath(''), async (req: Request, res: Response) => {
  logger.child({ name: 'Posts' });
  await tracer.startActiveSpan('Post posts/', async (requestSpan) => {
    try {
      const baseUrl = new Config.AuthUrl().getUrl();
      const postsService = new PostsService(new PostsRepository(baseUrl));
      const postResult = await postsService.fetchPosts();
      logger.info('posts---> is ', postResult);
      if (postResult) {
        const result = {
          count: postResult.length,
          firstRecord: postResult[0],
          lastRecord: postResult[length - 1],
        };
        res.status(200).send(result);
      } else {
        requestSpan.recordException(JSON.stringify('result is undefined!'));
        res.status(200).send('result is undefined');
      }
      requestSpan.setAttribute('http.status', 200);
    } catch (e) {
      logger.error(`error caught ->> ${(e as Error).message}`);
      requestSpan.setAttribute('http.status', 500);
      requestSpan.recordException(JSON.stringify(e));
      res.status(500).json({ error: 500, details: e });
    } finally {
      requestSpan.end();
    }
  });
});

export { postsRouter };
