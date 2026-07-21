// Sourced from the generated catalog (backend/src/constants/permissions.ts,
// via `npm run sync:permissions`) instead of re-declared string literals, so
// a renamed/removed backend key fails `tsc` here instead of silently going stale.
import { PERMISSIONS as ALL } from "@/lib/generated/permissions";

export const PERMISSIONS = {
  CATEGORIES_READ: ALL.CATEGORIES_READ,
  CATEGORIES_MANAGE: ALL.CATEGORIES_MANAGE,
} as const;
