// Must match backend/src/constants/permissions.ts — manually-synced contract,
// same pattern as the auth feature's cookie name constants.
export const PERMISSIONS = {
  CLIENTS_CREATE: "clients:create",
  CLIENTS_UPDATE: "clients:update",
  CLIENTS_DELETE: "clients:delete",
  CLIENTS_VIEW_ALL: "clients:view-all",
} as const;
