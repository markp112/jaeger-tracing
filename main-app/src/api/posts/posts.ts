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
  req.log.info('login called');
  await tracer.startActiveSpan('Post posts/', async (requestSpan) => {
    try {
      const baseUrl = new Config.AuthUrl().getUrl();
      req.log.info(baseUrl, '--base url');
      const postsService = new PostsService(new PostsRepository(baseUrl));
      const posts = await postsService.fetchPosts();
      logger.info('posts---> is ', posts);
      const result = {
        count: posts.length,
        firstRecord: posts[0],
        lastRecord: posts[length - 1],
      };

      requestSpan.setAttribute('http.status', 200);
      res.status(200).send(result);
    } catch (e) {
      logger.error(`error caught ->> ${JSON.stringify(e)}`);
      requestSpan.setAttribute('http.status', 500);
      res.status(500).json({ error: 500, details: e });
    } finally {
      requestSpan.end();
    }
  });
});

export { postsRouter };
