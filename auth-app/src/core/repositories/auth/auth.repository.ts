import { Credential } from '@model/auth/auth.model';
import { logger } from '@logger/logger';

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

interface Authentication {
  login(credentials: Credential):Promise<boolean>;
}

class AuthRepository implements Authentication {

  async login(credentials: Credential): Promise<boolean> {
    logger.info(credentials);
    await delay(5000);
    return true;
  }
}

export { AuthRepository };
export type { Authentication };
