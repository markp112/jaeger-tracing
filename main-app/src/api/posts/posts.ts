import { PostsService } from '@core/service/posts/posts.service';
import { logger } from '@logger/logger';
import { PostsRepository } from '@repository/posts/posts.repository';
import { Config } from '../../config/config';
import express, { Request, Response } from 'express';
import { PostType } from '@model/posts/posts.model';
import { PostApi } from './post.api';
// import { histogram } from 'prometheus/promClient';

const postsRouter = express.Router();
const ROUTE_PATH = '/posts';

const getPath = (pathToAppend: string) => `${ROUTE_PATH}/${pathToAppend}`;

postsRouter.get(getPath(''), async (req: Request, res: Response) => {
  logger.child({ name: 'Posts' });
  // const end = histogram.startTimer();
  // const name = req.query?.name;
  try {
    const postApi = new PostApi();
    // req.headers[]
    const postResult = await postApi.getPosts();
    logger.info(`post result ${JSON.stringify(postResult)}`);
    res.status(200).send(postResult);
  } catch (err) {
    res.status(500).json(err);
  }
  // res.on('finish', () =>
  //   end({
  //     method: req.method,
  //     handler: new URL(req.url, `http://${req.hostname}`).pathname,
  //     code: res.statusCode,
  //   })
  // );
});

postsRouter.get(getPath('no-trace'), async (req: Request, res: Response) => {
  req.log.child({ name: 'Posts' });
  req.log.info('no-trace called');
  try {
    const baseUrl = new Config.AuthUrl().getUrl();
    const postsService = new PostsService(new PostsRepository(baseUrl));
    const postResult: PostType[] = await postsService.fetchPosts();
    if (postResult) {
      const result = {
        count: postResult.length,
        firstRecord: postResult[0],
        lastRecord: postResult[postResult.length - 1],
      };
      res.status(200).send(result);
    } else {
      res.status(200).send('result is undefined');
    }
  } catch (e) {
    logger.error(`error caught ->> ${(e as Error).message}`);
    res.status(500).json({ error: 500, details: `${(e as Error).message}` });
  }
});

export { postsRouter };
