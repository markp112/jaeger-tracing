import { UserPermission } from '../models/auth/auth.model';
import { Authentication } from '../../repository/auth/auth.repository';

export class AuthService {
  constructor(private repository: Authentication) {}

  async getUserPermission(
    userPermission: UserPermission
  ): Promise<UserPermission> {
    return await this.repository.getUserPermission(userPermission);
  }
}
