import express from 'express';
import { initialiseServices } from '../../init/init';

const postsRouter = express.Router();
const ROUTE_PATH = '/posts';
const { postController, mainController } = {...initialiseServices()};

const getPath = (pathToAppend: string) => `${ROUTE_PATH}/${pathToAppend}`;

postsRouter.get(getPath(''), postController.getAllPosts.bind(postController));
postsRouter.get(getPath(':userId/:permission'), postController.getUserPosts.bind(postController));
postsRouter.get(getPath('posts-1'), mainController.getRoundTripPosts.bind(mainController));

export { postsRouter };
