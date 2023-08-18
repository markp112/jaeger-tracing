import { User } from '@prisma/client';

interface Credential {
  username: string;
  password: string;
};

interface UserType extends User {
  id: string;
  username: string;
}

export { Credential, UserType };
