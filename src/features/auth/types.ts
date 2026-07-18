export interface Role {
  id: string;
  name: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  roles: Role[];
  permissions: string[];
  // The Client.id this user is the portal login for, if any.
  portalClientId: string | null;
}
