import { tracer } from '../../tracing';
import { PostsService } from '@core/service/posts/posts.service';
import { logger } from '@logger/logger';
import { PostsRepository } from '@repository/posts/posts.repository';
import { Config } from '../../config/config';
import express, { Request, Response } from 'express';
import { PostType } from '@model/posts/posts.model';
import { PostApi } from './post.api';

const postsRouter = express.Router();
const ROUTE_PATH = '/posts';

const getPath = (pathToAppend: string) => `${ROUTE_PATH}/${pathToAppend}`;

postsRouter.get(getPath(''), async (req: Request, res: Response) => {
  logger.child({ name: 'Posts' });
  const postApi = new PostApi();
  const postResult = await postApi.getPosts();
  res.status(200).send(postResult);

  // await tracer.startActiveSpan('Get posts/', async (requestSpan) => {
  //   try {
  //     const baseUrl = new Config.AuthUrl().getUrl();
  //     const postsService = new PostsService(new PostsRepository(baseUrl));
  //     const postResult: PostType[] = await postsService.fetchPosts();
  //     if (postResult) {
  //       const result = {
  //         count: postResult.length,
  //         firstRecord: postResult[0],
  //         lastRecord: postResult[postResult.length - 1],
  //       };
  //       requestSpan.setAttribute('http.status', 200);
  //       res.status(200).send(result);
  //     } else {
  //       requestSpan.recordException(JSON.stringify('result is undefined!'));
  //       requestSpan.setAttribute('http.status', 200);
  //       res.status(200).send('result is undefined');
  //     }
  //   } catch (e) {
  //     logger.error(`error caught ->> ${(e as Error).message}`);
  //     requestSpan.setAttribute('http.status', 500);
  //     requestSpan.recordException(`${(e as Error).message}`);
  //     res.status(500).json({ error: 500, details: `${(e as Error).message}` });
  //   } finally {
  //     requestSpan.end();
  //   }
  // });
});

export { postsRouter };
