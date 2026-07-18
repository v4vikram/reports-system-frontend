// Must match backend/src/constants/permissions.ts — manually-synced contract,
// same pattern as the other features' constants.ts.
export const PERMISSIONS = {
  REPORTS_CREATE: "reports:create",
  REPORTS_READ: "reports:read",
  // Scope grant: see every report, not just ones you're assigned to.
  REPORTS_READ_ALL: "reports:read-all",
  REPORTS_UPDATE: "reports:update",
  REPORTS_DELETE: "reports:delete",
} as const;

// Holding either is enough to view reports (read-all is a broader scope, not
// an additional gate — see requirePermission's OR semantics on the backend).
export const REPORT_VIEW_PERMISSIONS: string[] = [PERMISSIONS.REPORTS_READ, PERMISSIONS.REPORTS_READ_ALL];
