import { MainRepositoryInterface } from '../../repository/main/main.respository';
import { PostType } from '../models/post/post.model';

export interface MainServiceInterface {
  getRoundTripPosts(): Promise<PostType[]>;
}

export class MainService implements MainServiceInterface {
  constructor(private repository: MainRepositoryInterface) {};
  async getRoundTripPosts(): Promise<PostType[]> {
      return this.repository.fetch<PostType[]>('/posts/post-2');
  }
}
