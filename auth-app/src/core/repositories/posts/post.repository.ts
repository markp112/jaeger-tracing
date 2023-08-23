import { PostType } from '@core/models/post/post.model';
import { PrismaClient } from '@prisma/client';
import { logger } from '@logger/logger';
import { PrismaClientInitializationError } from '@prisma/client/runtime/library';

interface PostRepo {
  fetch(): Promise<PostType[]>;
}

class PostRepository implements PostRepo {
  constructor(private client: PrismaClient) {}

  async fetch(): Promise<PostType[]> {
    logger.info('Post repository fetch called');
    try {
      return await this.client.post.findMany();
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

export type { PostRepo };

export { PostRepository };
