import { logger } from '@logger/logger';
import { PostType } from '@model/posts/posts.model';
import axios, { Axios } from 'axios';

interface PostsInterface {
  fetch(route: string): Promise<PostType[]>;
}

class PostsRepository implements PostsInterface {
  private axiosClient: Axios;

  constructor(private baseUrl: string) {
    this.axiosClient = axios.create({
      baseURL: this.baseUrl,
      timeout: 6000,
    });
  }

  async fetch(route: string): Promise<PostType[]> {
    try {
      logger.info(
        `repository: posts - baseUrl = ${this.baseUrl} and route = ${route}`
      );
      const result = await this.axiosClient.get(route, {
        headers: {
          'Content-Type': 'appplication/json',
          Accept: 'application/json',
        },
      });
      return result.data.data as PostType[];
    } catch (error) {
      logger.error(`Error from posts call${error}`);
      throw new Error(error);
    }
  }
}

export { PostsRepository };

export type { PostsInterface };
