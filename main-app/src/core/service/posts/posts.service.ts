import { logger } from '@logger/logger';
import { PostType } from '@model/posts/posts.model';
import type { PostsInterface } from '@repository/posts/posts.repository';
import { trace } from '@opentelemetry/api';
import { Span } from '@opentelemetry/sdk-trace-base';

class PostsService {
  constructor(private repository: PostsInterface) {}

  async fetchPosts(): Promise<PostType[]> {
    const tracer = trace.getTracer('Posts-Service');
    return await tracer.startActiveSpan('fetchPosts', async (span: Span) => {
      try {
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
