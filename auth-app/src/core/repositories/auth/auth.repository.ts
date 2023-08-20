import { Credential, UserType } from '@model/auth/auth.model';
import { logger } from '@logger/logger';
import { PrismaClient } from "@prisma/client";

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

interface Authentication {
  login(credentials: Credential, waitDelay: number):Promise<UserType>;
}

class AuthRepository implements Authentication {

  constructor(private client: PrismaClient) {}

  async login(credentials: Credential, waitDelay: number): Promise<UserType> {
    logger.info(credentials);
    await delay(waitDelay);
    const user = await this.client.user.findFirst({
      where: {
        username: 'test'
      },
    });
    if (!user) {
      throw new Error ('not Found')
    } else {
      return user;

    }
  }
}

export { AuthRepository };
export type { Authentication };
