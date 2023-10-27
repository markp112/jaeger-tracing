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
    try {
      return await this.client.post.findMany();
    } catch (err) {
      const errMsg = `Request failed: ${
        (err as PrismaClientInitializationError).message
      }`;
      logger.error(
        `Request failed: ${(err as PrismaClientInitializationError).message}`
      );
      throw new Error(errMsg);
    }
  }
}

export type { PostRepo };

export { PostRepository };
