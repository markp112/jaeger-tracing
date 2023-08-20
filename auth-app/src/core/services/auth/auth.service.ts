import { Authentication } from '@repository/auth/auth.repository';
import { Credential, UserType } from '@model/auth/auth.model';

class AuthService {

  constructor(private repository: Authentication) {}

  async login(credentials: Credential, waitDelay: number): Promise<UserType> {
    return await this.repository.login(credentials, waitDelay);
  } 
}

export { AuthService };
