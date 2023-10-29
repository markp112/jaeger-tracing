import { PostsController } from '@api/posts/posts.controller';
import { Config } from '@api/config/config';
import { logger } from '@logger/logger';
import { PrismaClient } from '@prisma/client';
import { AuthRepository } from '@core/repository/auth/auth.repository';
import { PostsRepository } from '@core/repository/posts/posts.repository';
import { AuthService } from '@core/services/auth/auth.service';
import { PostsService } from '@core/services/posts/posts.service';
import { MainController } from '@api/main/main.controller';
import { MainRepository } from '@core/repository/main/main.respository';
import { MainService } from '@core/services/main/main.service';

function initialiseServices() {
  const authUrl = new Config.AuthUrl().getUrl();
  const mainUrl = new Config.MainUrl().getUrl();
  logger.info(`authUrl -> ${authUrl}`);
  logger.info(`mainUrl -> ${mainUrl}`);
  const prismaClient = new PrismaClient();
  const postsService = new PostsService(new PostsRepository(prismaClient));
  const authService = new AuthService(new AuthRepository(authUrl));
  const postController = new PostsController(authService, postsService);
  const mainService = new MainService(new MainRepository(mainUrl));
  const mainController = new MainController(mainService)

  return { postController, mainController };
}

export { initialiseServices };
