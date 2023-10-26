import { logger } from '@logger/logger';
import { PostType } from '@model/posts/posts.model';
import type { PostsInterface } from '@repository/posts/posts.repository';
import { trace } from '@opentelemetry/api';
import { Span } from '@opentelemetry/sdk-trace-base';
import { UserPermission } from '@model/auth/auth.model';

export interface PostsServiceInterface {
  fetchPosts(permission: UserPermission): Promise<PostType[]>;
  fetchAllPosts(): Promise<PostType[]>;
  fetchPostsOne(): Promise<PostType[]>;
}
export class PostsService {
  constructor(private repository: PostsInterface) {}

  async fetchPosts(permission: UserPermission): Promise<PostType[]> {
    const currentSpan = trace.getActiveSpan();
    try {
      if (currentSpan) {
        currentSpan.setAttribute('requestId', 101);
        currentSpan.addEvent('event_data', {
          key: '123',
          request: 'get',
          id: '98e73',
        });
      }
      return await this.repository.fetch(
        `/posts/${permission.userId}/${permission.permission}`
      );
    } catch (error) {
      const errMsg = (error as Error).message;
      logger.error(`error in fetchPosts`, errMsg);
      if (currentSpan) {
        currentSpan.recordException(errMsg);
      }
      throw error;
    }
  }

  async fetchAllPosts(): Promise<PostType[]> {
    return await this.repository.fetch('/posts');
  }

  async fetchPostsOne(): Promise<PostType[]> {
    const currentSpan = trace.getActiveSpan();
    try {
      if (currentSpan) {
        currentSpan.setAttribute('requestId', 101);
      }
      return await this.repository.fetch('/posts/posts-1');
    } catch (error) {
      const errMsg = (error as Error).message;
      logger.error(`error in fetchPostsOne`, errMsg);
      if (currentSpan) {
        currentSpan.recordException(errMsg);
      }
      throw error;
    }
  }
}
