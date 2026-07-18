// Must match backend/src/constants/permissions.ts — manually-synced contract,
// same pattern as the auth feature's cookie name constants.
export const PERMISSIONS = {
  USERS_CREATE: "users:create",
  USERS_READ: "users:read",
  USERS_UPDATE: "users:update",
  USERS_DELETE: "users:delete",
} as const;

// Holding any of these is enough to view the employee directory.
export const USER_VIEW_PERMISSIONS: string[] = [
  PERMISSIONS.USERS_READ,
  PERMISSIONS.USERS_CREATE,
  PERMISSIONS.USERS_UPDATE,
  PERMISSIONS.USERS_DELETE,
];
