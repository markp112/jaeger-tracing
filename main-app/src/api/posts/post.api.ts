import { traceRequest } from '@api/decorators/tracing/tracing.decorator';
import { PostsService } from '@core/service/posts/posts.service';
import { PostType } from '@model/posts/posts.model';
import { PostsRepository } from '@repository/posts/posts.repository';
import { Config } from '../../config/config';
import { logger } from '@logger/logger';

type Result = {
  count: number;
  firstRecord: PostType;
  lastRecord: PostType;
};

class PostApi {
  @traceRequest('get posts')
  async getPosts(): Promise<Result> {
    logger.info('posts Api called');
    const baseUrl = new Config.AuthUrl().getUrl();
    const postsService = new PostsService(new PostsRepository(baseUrl));
    const postResult: PostType[] = await postsService.fetchPosts();
    logger.info(`post result ${JSON.stringify(postResult)}`);
    if (postResult) {
      const result: Result = {
        count: postResult.length,
        firstRecord: postResult[0],
        lastRecord: postResult[postResult.length - 1],
      };
      return result;
    }
  }
}

export { PostApi };
