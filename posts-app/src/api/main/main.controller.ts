import { Request, Response } from 'express';
import { BaseController } from '../common/responseResult';
import { MainServiceInterface } from '../../core/services/main/main.service';
import { traceRequest } from '@api/tracing/decorators';
import { logger } from '@logger/logger';
import { PostType } from '@core/services/models/post/post.model';
import { HttpStatusCode } from 'axios';


export class MainController extends BaseController {

  constructor(private mainService: MainServiceInterface) {
    super();
  }
  @traceRequest('posts/posts-1')
  async getRoundTripPosts(req: Request, res: Response) {
    logger.info(`${req.originalUrl} - called`)
    try {
      const result = await this.mainService.getRoundTripPosts();
      if (result) {
        res
          .status(HttpStatusCode.Ok)
          .send(this.getResult<PostType[]>(result));
      }
    } catch (err) {
      this.logAndSendError(err as Error, res);
    }
  }
}
