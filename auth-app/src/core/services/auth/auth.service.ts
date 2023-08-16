import { Authentication } from '@repository/auth/auth.repository';
import { Credential } from '@model/auth/auth.model';

class AuthService {

  constructor(private repository: Authentication) {}

  async login(credentials: Credential): Promise<boolean> {
    return await this.repository.login(credentials);
  } 
}

export { AuthService };
