import { PostType } from '@model/posts/posts.model';
import type { PostsInterface } from '@repository/posts/posts.repository';

class PostsService {
  constructor(private repository: PostsInterface) {}

  async fetchPosts(): Promise<PostType[]> {
    return await this.repository.fetch();
  }
}

export { PostsService };
