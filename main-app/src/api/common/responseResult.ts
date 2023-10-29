import { logger } from '@logger/logger';
import { HttpStatusCode } from 'axios';
import { Response } from 'express';

const ERROR_MESSAGE = 'Request failed';

export type ResultType<T> = {
  count: number;
  data: T;
};

export abstract class BaseController {
  getResult<T>(data: T): ResultType<T> {
    let records = 1;
    if (Array.isArray(data)) {
      records = data.length;
    }
    return {
      count: records,
      data,
    };
  }
  logAndSendError(error: Error, res: Response): void {
    logger.error(error);
    res
      .status(HttpStatusCode.InternalServerError)
      .send(this.getResult<string>(ERROR_MESSAGE));
  }
}

