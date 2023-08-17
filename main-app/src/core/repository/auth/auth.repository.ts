import { Credential } from '@model/auth/auth.model';
import { logger } from '@logger/logger';
import axios, { Axios } from 'axios';


interface Authentication {
  login(credentials: Credential):Promise<boolean>;
}

class AuthRepository implements Authentication {

  private axiosClient: Axios;

  constructor(private baseUrl: string) {
    this.axiosClient = axios.create({
      baseURL: this.baseUrl,
      timeout: 6000
    });
  };

  async login(credentials: Credential): Promise<boolean> {
    logger.info('respository -login -called')
    logger.info(credentials);
    try {
      logger.info(this.axiosClient.getUri(),'uri');
      const result = await this.axiosClient.post('/auth/login', credentials);
      logger.info(result);
      return true;
    } catch (error) {
      logger.error(error);
      
    }
  }
}

export { AuthRepository };
export type { Authentication };
