import { logger } from '@logger/logger';
import { PostType } from '@model/posts/posts.model';
import type { PostsInterface } from '@repository/posts/posts.repository';

class PostsService {
  constructor(private repository: PostsInterface) {}

  async fetchPosts(): Promise<PostType[]> {
    try {
      const result = await this.repository.fetch();
      logger.info(`result from repository is: ${JSON.stringify(result)}`);
      logger.info(`result from repository is: ${result.length}`);
      return result;
    } catch (error) {
      logger.error(`errored in fetchPosts`, (error as Error).message);
      throw new Error('I have been hiding down here !');
    }
  }
}

export { PostsService };
