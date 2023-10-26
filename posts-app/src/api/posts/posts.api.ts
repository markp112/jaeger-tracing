import express from 'express';
import { initialiseServices } from '../../init/init';

const postsRouter = express.Router();
const ROUTE_PATH = '/posts';
const postController = initialiseServices().postController;

const getPath = (pathToAppend: string) => `${ROUTE_PATH}/${pathToAppend}`;

postsRouter.get(getPath(''), postController.getAllPosts.bind(postController));
postsRouter.get(
  getPath(':userId/:permission'),
  postController.getUserPosts.bind(postController)
);

export { postsRouter };
