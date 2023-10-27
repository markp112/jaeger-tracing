import { PostController } from '@api/posts/post.controller';
import { AuthService } from '@core/service/auth/auth.service';
import { PostsService } from '@core/service/posts/posts.service';
import { AuthRepository } from '@repository/auth/auth.repository';
import { PostsRepository } from '@repository/posts/posts.repository';
import { Config } from '../config/config';
import { logger } from '@logger/logger';
import { ControllerErrorHandler } from '@api/common/errorHandler';

function initialiseServices() {
  const authUrl = new Config.AuthUrl().getUrl();
  const postUrl = new Config.PostUrl().getUrl();
  logger.info(`postUrl -> ${postUrl}`);
  logger.info(`authUrl -> ${authUrl}`);
  const postsService = new PostsService(new PostsRepository(postUrl));
  const authService = new AuthService(new AuthRepository(authUrl));
  const errorHandler = new ControllerErrorHandler();
  const postController = new PostController(
    authService,
    postsService,
    errorHandler
  );

  return { postController };
}

export { initialiseServices };
