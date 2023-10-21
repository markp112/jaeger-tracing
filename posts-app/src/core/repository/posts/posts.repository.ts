import { PostType } from '@core/services/models/post/post.model';
import { logger } from '@logger/logger';
import { PrismaClient } from '@prisma/client';
import { PrismaClientInitializationError } from '@prisma/client/runtime/library';

interface PostRepo {
  getUserPosts(userId: string): Promise<PostType[]>;
}

export class PostsRepository implements PostRepo {
  constructor(private client: PrismaClient) {}

  async getUserPosts(userId: string): Promise<PostType[]> {
    logger.info('Post repository fetch called');
    try {
      return await this.client.post.findMany({
        include: {
          userPost: false,
        },
        where: {
          userPost: {
            every: {
              userId: userId,
            },
          },
        },
      });
    } catch (err) {
      logger.error(
        `Request failed: code: ${
          (err as PrismaClientInitializationError).errorCode
        } mesg: ${(err as PrismaClientInitializationError).message}`
      );
      throw new Error((err as PrismaClientInitializationError).message);
    }
  }
}
