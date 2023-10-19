import { Credential, UserType } from '@model/auth/auth.model';
import { logger } from '@logger/logger';
import { PrismaClient } from '@prisma/client';
import { PrismaClientInitializationError } from '@prisma/client/runtime/library';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface Authentication {
  login(credentials: Credential, waitDelay: number): Promise<UserType>;
}

class AuthRepository implements Authentication {
  constructor(private client: PrismaClient) {}

  async login(credentials: Credential, waitDelay: number): Promise<UserType> {
    await delay(waitDelay);
    try {
      const user = await this.client.user.findFirst({
        where: {
          username: 'test',
        },
      });
      if (!user) {
        throw new Error('not Found');
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
}

export { AuthRepository };
export type { Authentication };
