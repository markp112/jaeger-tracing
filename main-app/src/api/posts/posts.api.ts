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

// postsRouter.get(getPath('post-1'), async (req: Request, res: Response) => {
//   logger.child({ name: 'Posts-1' });
//   try {
//     const postApi = new PostApi();
//     const postResult = await postApi.getPostsOne();
//     logger.info(`post result ${JSON.stringify(postResult)}`);
//     res.status(200).send(postResult);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// postsRouter.get(getPath('post-2'), async (req: Request, res: Response) => {
//   logger.child({ name: 'Posts' });
//   try {
//     const postApi = new PostApi();
//     const postResult = await postApi.getPosts();
//     logger.info(`post result ${JSON.stringify(postResult)}`);
//     res.status(200).send(postResult);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// postsRouter.get(getPath(''), async (req: Request, res: Response) => {
//   logger.child({ name: 'Posts' });
//   try {
//     const postApi = new PostApi();
//     const postResult = await postApi.getPosts();
//     logger.info(`post result ${JSON.stringify(postResult)}`);
//     res.status(200).send(postResult);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// postsRouter.get(getPath('no-trace'), async (req: Request, res: Response) => {
//   req.log.child({ name: 'no-trace' });
//   req.log.info('no-trace called');
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
//       res.status(200).send(result);
//     } else {
//       res.status(200).send('result is undefined');
//     }
//   } catch (e) {
//     logger.error(`error caught ->> ${(e as Error).message}`);
//     res.status(500).json({ error: 500, details: `${(e as Error).message}` });
//   }
// });

export { postsRouter };
