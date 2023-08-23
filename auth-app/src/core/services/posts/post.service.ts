import { PostType } from '@core/models/post/post.model';
import { PostRepo } from '@core/repositories/posts/post.repository';

class PostService {
  constructor(private repository: PostRepo) {}

  async fetchPosts(): Promise<PostType[]> {
    return await this.repository.fetch();
  }
}

export { PostService };
