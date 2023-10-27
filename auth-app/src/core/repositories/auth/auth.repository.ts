import { UserPermission, UserType } from '@model/auth/auth.model';
import { logger } from '@logger/logger';
import { PrismaClient } from '@prisma/client';
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
    try {
      const permissionExists = await this.client.userPermissions.findFirst({
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
      if (permissionExists) {
        return {
          permission: permissionExists.permission.permission,
          userId: permissionExists.userId,
          isGranted: true,
        };
      }
      return {
        permission: requestedPermission.permission,
        userId: requestedPermission.userId,
        isGranted: false,
      };
    } catch (err) {
      logger.error(
        `Request failed: code: ${
          (err as PrismaClientInitializationError).errorCode
        } mesg: ${(err as PrismaClientInitializationError).message}`
      );
      throw new Error((err as PrismaClientInitializationError).message);
    }
  }
}

export { AuthRepository };
export type { Authentication };
