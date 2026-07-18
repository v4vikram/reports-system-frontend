// Must match backend/src/constants/permissions.ts — manually-synced contract,
// same pattern as the auth feature's cookie name constants.
export const PERMISSIONS = {
  CLIENTS_READ: "clients:read",
  // Scope grant: see/manage all clients rather than only assigned ones.
  CLIENTS_READ_ALL: "clients:read-all",
  CLIENTS_CREATE: "clients:create",
  CLIENTS_UPDATE: "clients:update",
  CLIENTS_DELETE: "clients:delete",
} as const;
