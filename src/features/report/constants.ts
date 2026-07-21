// Sourced from the generated catalog (backend/src/constants/permissions.ts,
// via `npm run sync:permissions`) instead of re-declared string literals, so
// a renamed/removed backend key fails `tsc` here instead of silently going stale.
import { PERMISSIONS as ALL } from "@/lib/generated/permissions";

export const PERMISSIONS = {
  REPORTS_CREATE: ALL.REPORTS_CREATE,
  REPORTS_READ: ALL.REPORTS_READ,
  // Scope grant: see every report, not just ones you're assigned to.
  REPORTS_READ_ALL: ALL.REPORTS_READ_ALL,
  REPORTS_UPDATE: ALL.REPORTS_UPDATE,
  REPORTS_DELETE: ALL.REPORTS_DELETE,
} as const;

// Holding either is enough to view reports (read-all is a broader scope, not
// an additional gate — see requirePermission's OR semantics on the backend).
export const REPORT_VIEW_PERMISSIONS: string[] = [PERMISSIONS.REPORTS_READ, PERMISSIONS.REPORTS_READ_ALL];
