import { UserPermission, UserType } from '@model/auth/auth.model';
import { logger } from '@logger/logger';
import { Permission, PrismaClient } from '@prisma/client';
import { PrismaClientInitializationError } from '@prisma/client/runtime/library';

interface Authentication {
  getUser(name: string): Promise<UserType | undefined>;
  getUserPermission(
    requestedPermission: UserPermission
  ): Promise<UserPermission>;
}

class AuthRepository implements Authentication {
  constructor(private client: PrismaClient) {}

  async getUser(name: string): Promise<UserType | undefined> {
    try {
      const user = await this.client.user.findFirst({
        where: {
          username: name,
        },
      });
      if (!user) {
        return undefined;
      } else {
        return user;
      }
    } catch (err) {
      logger.error(
        `Request failed: code: ${
          (err as PrismaClientInitializationError).errorCode
        } mesg: ${(err as PrismaClientInitializationError).message}`
      );
      throw new Error((err as PrismaClientInitializationError).message);
    }
  }

  async getUserPermission(
    requestedPermission: UserPermission
  ): Promise<UserPermission> {
    return await this.getPermission(requestedPermission);
  }

  private async getPermission(requestedPermission: UserPermission): Promise<UserPermission> {
    try {
      const result = await this.client.userPermissions.findFirst({
        include: {
          permission: true,
        },
        where: {
          userId: requestedPermission.userId,
          permission: {
            permission: requestedPermission.permission,
          },
        },
      });
      if (result) {
        return this.constructPermission(result.permission.permission, result.userId, true);
      } else {
        return this.constructPermission(requestedPermission.permission, requestedPermission.userId, false);
      }
    } catch (err) {
      logger.error(
        `Request failed: code: ${
          (err as PrismaClientInitializationError).errorCode
        } mesg: ${(err as PrismaClientInitializationError).message}`
      );
      throw new Error((err as PrismaClientInitializationError).message);
    }
  }
  private constructPermission(permission: string, userId: string, isGranted: boolean): UserPermission {
    return {
      userId,
      permission,
      isGranted
    };
  }
}

export { AuthRepository };
export type { Authentication };
