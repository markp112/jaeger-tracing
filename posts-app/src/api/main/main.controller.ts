import { Request, Response } from 'express';
import { BaseController } from '../common/responseResult';
import { MainServiceInterface } from '../../core/services/main/main.service';
import { traceRequest } from '@api/tracing/decorators';
import { logger } from '@logger/logger';


export class MainController extends BaseController {

  constructor(private mainService: MainServiceInterface) {
    super();
  }
  @traceRequest('posts/posts-1')
  async getRoundTripPosts(req: Request, res: Response) {
    logger.info(`${req.originalUrl} - called`)
    await this.mainService.getRoundTripPosts();
  }
}
