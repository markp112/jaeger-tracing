import { Credential, UserType } from '@model/auth/auth.model';
import { logger } from '@logger/logger';
import axios, { Axios } from 'axios';

interface Authentication {
  login(credentials: Credential):Promise<UserType>;
}

class AuthRepository implements Authentication {

  private axiosClient: Axios;

  constructor(private baseUrl: string) {
    this.axiosClient = axios.create({
      baseURL: this.baseUrl,
      timeout: 6000
    });
  };

  async login(credentials: Credential): Promise<UserType> {
    logger.info(credentials);
    try {
      logger.info(this.axiosClient.getUri(),'uri');
      const result = await this.axiosClient.post('/auth/login', credentials);
      return result.data as UserType;
    } catch (error) {
      logger.error(error);
      throw new Error(error.details);
    }
  }
}

export { AuthRepository };
export type { Authentication };
