import { PostsRepository } from '@core/repository/posts/posts.repository';
import { Post } from '@prisma/client';

export interface PostsServiceInterface {
  getUserPosts(userId: string): Promise<Post[]>;
  getAllPosts(): Promise<Post[]>;
}
export class PostsService implements PostsServiceInterface {
  constructor(private repository: PostsRepository) {}

  async getUserPosts(userId: string): Promise<Post[]> {
    return await this.repository.getUserPosts(userId);
  }

  async getAllPosts(): Promise<Post[]> {
    return await this.repository.getAllPosts();
  }
}
