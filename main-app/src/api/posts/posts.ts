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
  try {
    const postApi = new PostApi();
    const postResult = await postApi.getPosts();
    logger.info(`post result ${JSON.stringify(postResult)}`);
    res.status(200).send(postResult);
  } catch (err) {
    res.status(500).send(err);
  }
});

export { postsRouter };
