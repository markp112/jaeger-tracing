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
    logger.info(credentials);
    const result = await this.axiosClient.post('/auth/login', credentials);
    console.log('%c⧭', 'color: #ff0000', result);
    return true;
  }
}

export { AuthRepository };
export type { Authentication };
