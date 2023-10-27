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
    const result = await this.axiosClient.get(
      `/auth/user/${requestedPermission.userId}/permission/${requestedPermission.permission}`
    );
    return result.data.data as UserPermission;
  }
}
