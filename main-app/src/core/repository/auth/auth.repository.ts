import { UserPermission, UserType } from '@model/auth/auth.model';
import { logger } from '@logger/logger';
import axios, { Axios } from 'axios';

interface Authentication {
  getUser(userName: string): Promise<UserType>;
  getUserPermissions(permission: UserPermission): Promise<UserPermission>;
}

class AuthRepository implements Authentication {
  private axiosClient: Axios;

  constructor(private baseUrl: string) {
    this.axiosClient = axios.create({
      baseURL: this.baseUrl,
      timeout: 6000,
    });
  }

  async getUser(userName: string): Promise<UserType> {
    try {
      logger.info(this.axiosClient.getUri(), 'uri');
      const result = await this.axiosClient.get(`/auth/user/${userName}`);
      logger.info(`-->${(result.data as UserType).id}`);
      return result.data as UserType;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async getUserPermissions(
    permission: UserPermission
  ): Promise<UserPermission> {
    try {
      logger.info(this.axiosClient.getUri(), 'uri');
      const result = await this.axiosClient.get(
        `auth/user/${permission.userId}/permission/${permission.permission}`
      );
      return result.data as UserPermission;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
}

export { AuthRepository };
export type { Authentication };
