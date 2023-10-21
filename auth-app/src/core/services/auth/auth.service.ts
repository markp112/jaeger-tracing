import { Authentication } from '@repository/auth/auth.repository';
import { UserPermission, UserType } from '@model/auth/auth.model';

class AuthService {
  constructor(private repository: Authentication) {}

  async getUser(name: string): Promise<UserType | undefined> {
    return await this.repository.getUser(name);
  }

  async getUserPermission(
    userPermission: UserPermission
  ): Promise<UserPermission> {
    return await this.repository.getUserPermission(userPermission);
  }
}

export { AuthService };
