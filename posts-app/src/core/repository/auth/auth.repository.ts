import { UserPermission } from '@core/services/models/auth/auth.model';
import { logger } from '@logger/logger';
import axios, { Axios } from 'axios';

export interface Authentication {
  getUserPermission(
    requestedPermission: UserPermission
  ): Promise<UserPermission>;
}

export class AuthRepository implements Authentication {
  private axiosClient: Axios;

  constructor(private baseUrl: string) {
    this.axiosClient = axios.create({
      baseURL: this.baseUrl,
      timeout: 6000,
    });
  }

  async getUserPermission(
    requestedPermission: UserPermission
  ): Promise<UserPermission> {
    logger.info(this.axiosClient.getUri(), 'uri');
    const result = await this.axiosClient.get(
      `/auth/user/${requestedPermission.userId}/${requestedPermission.permission}`
    );
    return result.data as UserPermission;
  }
}
