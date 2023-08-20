import { Authentication } from '../../repository/auth/auth.repository';
import { Credential, UserType } from '@model/auth/auth.model';

class AuthService {

  constructor(private repository: Authentication) {}

  async login(credentials: Credential): Promise<UserType> {
    return await this.repository.login(credentials);
  } 
}

export { AuthService };
