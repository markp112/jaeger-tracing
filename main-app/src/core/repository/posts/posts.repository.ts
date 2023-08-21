import { logger } from '@logger/logger';
import { PostType } from '@model/posts/posts.model';
import axios, { Axios } from 'axios';

interface Posts {
  fetch(): Promise<PostType[]>;
}

class PostsRepository implements Posts {
  private axiosClient: Axios;

  constructor(private baseUrl: string) {
    this.axiosClient = axios.create({
      baseURL: this.baseUrl,
      timeout: 6000,
    });
  }

  async fetch(): Promise<PostType[]> {
    try {
      logger.info(this.axiosClient.getUri(), 'uri');
      const result = await this.axiosClient.post('/posts');
      return result.data as PostType[];
    } catch (error) {
      logger.error(error);
      throw new Error(error.details);
    }
  }
}

export { PostsRepository };

export type { Posts };
