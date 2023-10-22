import express from 'express';
import { PostController } from './post.controller';

const postsRouter = express.Router();
const ROUTE_PATH = '/posts';

const getPath = (pathToAppend: string) => `${ROUTE_PATH}/${pathToAppend}`;

postsRouter.get(getPath('post-1'), PostController.getRoundTripPosts);
postsRouter.get(getPath('post-2'), PostController.getAllPosts);
postsRouter.get(getPath('no-trace'), PostController.noTrace);
postsRouter.get(getPath(''), PostController.getAllPosts);
postsRouter.get(getPath('/user/:username'), PostController.getUserPosts);

export { postsRouter };
