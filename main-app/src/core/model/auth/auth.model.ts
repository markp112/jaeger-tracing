interface UserType {
  id: string;
  username: string;
}

interface UserPermission {
  userId: string;
  permission: string;
  isGranted?: boolean;
}
export type { UserPermission, UserType };
