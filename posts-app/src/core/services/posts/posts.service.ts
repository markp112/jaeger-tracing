import { PostsRepository } from '@core/repository/posts/posts.repository';
import { Post } from '@prisma/client';

export class PostsService {
  constructor(private repository: PostsRepository) {}

  async getUserPosts(userId: string): Promise<Post[]> {
    return await this.repository.getUserPosts(userId);
  }

  async getAllPosts() {
    return await this.repository.getAllPosts();
  }
}
