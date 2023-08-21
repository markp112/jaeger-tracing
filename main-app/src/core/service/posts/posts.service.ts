import { PostType } from '@model/posts/posts.model';
import { Posts } from '@repository/posts/posts.repository';

class PostsService {
  constructor(private repository: Posts) {}

  async fetchPosts(): Promise<PostType[]> {
    return await this.repository.fetch();
  }
}

export { PostsService };
