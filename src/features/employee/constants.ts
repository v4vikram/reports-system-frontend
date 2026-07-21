// Sourced from the generated catalog (backend/src/constants/permissions.ts,
// via `npm run sync:permissions`) instead of re-declared string literals, so
// a renamed/removed backend key fails `tsc` here instead of silently going stale.
import { PERMISSIONS as ALL } from "@/lib/generated/permissions";

export const PERMISSIONS = {
  USERS_CREATE: ALL.USERS_CREATE,
  USERS_READ: ALL.USERS_READ,
  USERS_UPDATE: ALL.USERS_UPDATE,
  USERS_DELETE: ALL.USERS_DELETE,
} as const;

// Holding any of these is enough to view the employee directory.
export const USER_VIEW_PERMISSIONS: string[] = [
  PERMISSIONS.USERS_READ,
  PERMISSIONS.USERS_CREATE,
  PERMISSIONS.USERS_UPDATE,
  PERMISSIONS.USERS_DELETE,
];
