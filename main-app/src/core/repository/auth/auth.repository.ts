import { Credential } from '@model/auth/auth.model';
import { logger } from '@logger/logger';
import axios from 'axios';


interface Authentication {
  login(credentials: Credential):Promise<boolean>;
}

class AuthRepository implements Authentication {

  constructor(private baseUrl: string) {};

  async login(credentials: Credential): Promise<boolean> {
    logger.info(credentials);
    const result = await axios.post(`${this.baseUrl}/auth/login`, credentials);
    console.log('%c⧭', 'color: #ff0000', result);
    return true;
  }
}

export { AuthRepository };
export type { Authentication };
