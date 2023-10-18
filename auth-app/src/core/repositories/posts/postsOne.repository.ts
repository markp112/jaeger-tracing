import { logger } from '@logger/logger';
import { PostType } from '@core/models/post/post.model';
import axios, { Axios } from 'axios';

interface ApiRepository {
  fetch(route: string): Promise<PostType[]>;
}

class PostsOneRepository implements ApiRepository {
  private axiosClient: Axios;

  constructor(private baseUrl: string) {
    this.axiosClient = axios.create({
      baseURL: this.baseUrl,
      timeout: 6000,
    });
  }

  async fetch(route: string): Promise<PostType[]> {
    try {
      const result = await this.axiosClient.get(route, {
        headers: {
          'Content-Type': 'appplication/json',
          Accept: 'application/json',
        },
      });
      return result.data.data as PostType[];
    } catch (error) {
      logger.error(`Error from posts call${error}`);
      throw new Error((error as Error).message);
    }
  }
}

export { PostsOneRepository };

export type { ApiRepository };
