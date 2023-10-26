import { PostsController } from '@api/posts/posts.controller';
import { Config } from '@api/config/config';
import { logger } from '@logger/logger';
import { PrismaClient } from '@prisma/client';
import { AuthRepository } from '@core/repository/auth/auth.repository';
import { PostsRepository } from '@core/repository/posts/posts.repository';
import { AuthService } from '@core/services/auth/auth.service';
import { PostsService } from '@core/services/posts/posts.service';

function initialiseServices() {
  const authUrl = new Config.AuthUrl().getUrl();
  logger.info(`authUrl -> ${authUrl}`);
  const prismaClient = new PrismaClient();
  const postsService = new PostsService(new PostsRepository(prismaClient));
  const authService = new AuthService(new AuthRepository(authUrl));
  const postController = new PostsController(authService, postsService);

  return { postController };
}

export { initialiseServices };
