interface UserPermission {
  userId: string;
  permission: string;
  isGranted?: boolean;
}

export { UserPermission };
