import express from 'express';
import { PostsController } from './posts.controller';

const postsRouter = express.Router();
const ROUTE_PATH = '/posts';

const getPath = (pathToAppend: string) => `${ROUTE_PATH}/${pathToAppend}`;

postsRouter.get(getPath(':userId/:permission'), PostsController.getUserPosts);
postsRouter.get(getPath(''), PostsController.getAllPosts);

export { postsRouter };
