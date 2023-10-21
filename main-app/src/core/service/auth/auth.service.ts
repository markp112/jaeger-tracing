import { Authentication } from '../../repository/auth/auth.repository';
import { UserPermission, UserType } from '@model/auth/auth.model';

class AuthService {
  constructor(private repository: Authentication) {}

  async getUser(username: string): Promise<UserType> {
    return await this.repository.getUser(username);
  }

  async getUserPermissions(
    permission: UserPermission
  ): Promise<UserPermission> {
    return await this.repository.getUserPermissions(permission);
  }
}

export { AuthService };
