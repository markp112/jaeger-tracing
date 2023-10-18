import { PostType } from '@core/models/post/post.model';
import { PostRepo } from '@core/repositories/posts/post.repository';
import { ApiRepository } from '@core/repositories/posts/postsOne.repository';

class PostService {
  constructor(private repository: PostRepo) {}

  async fetchPosts(): Promise<PostType[]> {
    return await this.repository.fetch();
  }
}

class PostOneService {
  constructor(private repository: ApiRepository) {}

  async fetchPosts(route: string): Promise<PostType[]> {
    return await this.repository.fetch(route);
  }
}

export { PostService, PostOneService };
