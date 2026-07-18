// Must match backend/src/constants/permissions.ts — manually-synced contract,
// same pattern as the auth feature's cookie name constants.
export const PERMISSIONS = {
  CATEGORIES_READ: "categories:read",
  CATEGORIES_MANAGE: "categories:manage",
} as const;
