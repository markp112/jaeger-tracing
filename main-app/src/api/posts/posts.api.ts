import express from 'express';
import { initialiseServices } from '../../init/init';

const postsRouter = express.Router();
const ROUTE_PATH = '/posts';
const postController = initialiseServices().postController;

const getPath = (pathToAppend: string) => `${ROUTE_PATH}/${pathToAppend}`;

postsRouter.get(
  getPath('post-1'),
  postController.getRoundTripPosts.bind(postController)
);
postsRouter.get(
  getPath('post-2'),
  postController.getAllPosts.bind(postController)
);
postsRouter.get(
  getPath('user/:username'),
  postController.getUserPosts.bind(postController)
);
postsRouter.get(
  getPath('no-trace'),
  postController.noTrace.bind(postController)
);
postsRouter.get(getPath(''), postController.getAllPosts.bind(postController));

export { postsRouter };
