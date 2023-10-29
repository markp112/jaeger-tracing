import { UserPermission, UserType } from '@model/auth/auth.model';
import { Authentication } from '../repositories/auth/auth.repository';

export interface AuthServiceInterface {
  getUser(name: string): Promise<UserType | undefined>;
  getUserPermission(userPermission: UserPermission): Promise<UserPermission>;
}

class AuthService implements AuthServiceInterface {

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
