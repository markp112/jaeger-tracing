import { logger } from '@logger/logger';
import { PostType } from '@model/posts/posts.model';
import type { PostsInterface } from '@repository/posts/posts.repository';
import { trace } from '@opentelemetry/api';
import { Span } from '@opentelemetry/sdk-trace-base';

class PostsService {
  constructor(private repository: PostsInterface) {}

  async fetchPosts(): Promise<PostType[]> {
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
        const result = await this.repository.fetch();
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
