export interface Role {
  id: string;
  name: string;
  description: string | null;
  isSystem: boolean;
}

export interface Permission {
  id: string;
  key: string;
  description: string | null;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  roles: { id: string; name: string }[];
  // Direct grants only — not the effective (role + direct) permission set.
  directPermissions: string[];
}
