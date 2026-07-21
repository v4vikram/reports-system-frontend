// Sourced from the generated catalog (backend/src/constants/permissions.ts,
// via `npm run sync:permissions`) instead of re-declared string literals, so
// a renamed/removed backend key fails `tsc` here instead of silently going stale.
import { PERMISSIONS as ALL } from "@/lib/generated/permissions";

export const PERMISSIONS = {
  CLIENTS_READ: ALL.CLIENTS_READ,
  // Scope grant: see/manage all clients rather than only assigned ones.
  CLIENTS_READ_ALL: ALL.CLIENTS_READ_ALL,
  CLIENTS_CREATE: ALL.CLIENTS_CREATE,
  CLIENTS_UPDATE: ALL.CLIENTS_UPDATE,
  CLIENTS_DELETE: ALL.CLIENTS_DELETE,
} as const;
