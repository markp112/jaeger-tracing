import { logger } from '@logger/logger';
import { PostType } from '@model/posts/posts.model';
import type { PostsInterface } from '@repository/posts/posts.repository';
import { trace } from '@opentelemetry/api';
import { Span } from '@opentelemetry/sdk-trace-base';
import { UserPermission } from '@model/auth/auth.model';

class PostsService {
  constructor(private repository: PostsInterface) {}

  async fetchPosts(permission: UserPermission): Promise<PostType[]> {
    const tracer = trace.getTracer('posts.Service');
    return await tracer.startActiveSpan('fetchPosts', async (span: Span) => {
      try {
        const currentSpan = trace.getActiveSpan();
        currentSpan.setAttribute('requestId', 101);
        currentSpan.addEvent('event_data', {
          key: '123',
          request: 'get',
          id: '98e73',
        });
        const result = await this.repository.fetch(
          `/posts/${permission.userId}/${permission.permission}`
        );
        return result;
      } catch (error) {
        const errMsg = (error as Error).message;
        logger.error(`errored in fetchPosts`, errMsg);
        span.recordException(errMsg);
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async fetchAllPosts(): Promise<PostType[]> {
    return await this.repository.fetch('/posts');
  }

  async fetchPostsOne(): Promise<PostType[]> {
    const tracer = trace.getTracer('posts.Service');
    return await tracer.startActiveSpan('fetchPosts', async (span: Span) => {
      try {
        const currentSpan = trace.getActiveSpan();
        currentSpan.setAttribute('requestId', 101);
        const result = await this.repository.fetch('/posts/posts-1');
        return result;
      } catch (error) {
        const errMsg = (error as Error).message;
        logger.error(`errored in fetchPosts`, errMsg);
        span.recordException(errMsg);
        throw error;
      } finally {
        span.end();
      }
    });
  }
}

export { PostsService };
