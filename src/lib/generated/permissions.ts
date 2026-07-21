// GENERATED FILE — do not hand-edit.
// Source of truth: backend/src/constants/permissions.ts
// Regenerate with `npm run sync:permissions` in backend/ after changing it,
// then commit the diff. Every feature's constants.ts should reference these
// keys (not re-declare string literals) so a backend rename/removal becomes
// a compile error here instead of a silently-stale permission check.
export const PERMISSIONS = {
  USERS_CREATE: "users:create",
  USERS_READ: "users:read",
  USERS_UPDATE: "users:update",
  USERS_DELETE: "users:delete",
  CLIENTS_READ: "clients:read",
  CLIENTS_READ_ALL: "clients:read-all",
  CLIENTS_CREATE: "clients:create",
  CLIENTS_UPDATE: "clients:update",
  CLIENTS_DELETE: "clients:delete",
  CATEGORIES_READ: "categories:read",
  CATEGORIES_MANAGE: "categories:manage",
  REPORTS_CREATE: "reports:create",
  REPORTS_READ: "reports:read",
  REPORTS_READ_ALL: "reports:read-all",
  REPORTS_UPDATE: "reports:update",
  REPORTS_DELETE: "reports:delete",
} as const;

export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
