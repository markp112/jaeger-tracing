import { logger } from '@logger/logger';
import { PostType } from '@model/posts/posts.model';
import type { PostsInterface } from '@repository/posts/posts.repository';

class PostsService {
  constructor(private repository: PostsInterface) {}

  async fetchPosts(): Promise<PostType[]> {
    const result = await this.repository.fetch();
    logger.info(`result from repository is: ${result[0]}`);
    return result;
  }
}

export { PostsService };
