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
      const result = await this.axiosClient.get('/posts', {
        headers: {
          'Content-Type': 'appplication/json',
          Accept: 'application/json',
        },
      });
      logger.info(`result returned:--> ${JSON.stringify(result)}`);
      return result.data as PostType[];
    } catch (error) {
      logger.error(`Error from posts call${error}`);
      throw new Error(error.details);
    }
  }
}

export { PostsRepository };

export type { Posts };
