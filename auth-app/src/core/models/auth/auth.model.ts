import { User } from '@prisma/client';

interface UserType extends User {
  id: string;
  username: string;
}

interface UserPermission {
  userId: string;
  permission: string;
  isGranted?: boolean;
}

export { UserType, UserPermission };
