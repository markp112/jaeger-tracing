import { Response } from 'express';
import { logger } from '@logger/logger';
import { HttpStatusCode } from 'axios';
import { Result } from './responseResult';

const ERROR_MESSAGE = 'request failed';
export interface ErrorHandler {
  logAndSendError(error: Error, res: Response): void;
}

export class ControllerErrorHandler extends Result implements ErrorHandler {
  logAndSendError(error: Error, res: Response): void {
    logger.error(error);
    res
      .status(HttpStatusCode.InternalServerError)
      .send(this.getResult<string>(ERROR_MESSAGE));
  }
}
